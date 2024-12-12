
@Injectable()
export class LoyaltyEngineProgramsService {
  constructor(
    

    private subPurchaseOrderService: SubPurchaseOrderService,
  ) {}

  async get(
    clientModel: ClientsEntity,
    query: GetProgramRequestDTO,
  ): Promise<any> {
    const { skip, limit } = query;
    const queryBuilder = await this.programsRepository
      .createQueryBuilder('program')
      .where({
        clientId: clientModel.id,
      })
      .select([
        'program.endDate',
        'program.description',
        'program.startDate',
        'program.type',
        'program.name',
        'program.status',
        'program.id',
      ])
      .skip(skip)
      .take(limit)
      .orderBy({
        id: 'DESC',
      });
    if (query.name) {
      queryBuilder.andWhere({
        name: ILike(`%${query.name}%`),
      });
    }

    if (query.type) {
      queryBuilder.andWhere({
        type: String(query.type),
      });
    }

    if (query.status) {
      queryBuilder.andWhere({
        status: query.status,
      });
    }

    if (query.id) {
      queryBuilder.andWhere({
        id: Number(query.id),
      });
    }

    if (query.toStartDate && query.fromStartDate) {
      queryBuilder.andWhere({
        startDate: Between(query.fromStartDate, query.toStartDate),
      });
    }

    if (query.toEndDate && query.fromEndDate) {
      queryBuilder.andWhere({
        endDate: Between(query.fromEndDate, query.toEndDate),
      });
    }

    const [programsModel, total] = await queryBuilder.getManyAndCount();

    return {
      data: programsModel,
      limit,
      skip,
      total,
    };
  }

  async getDetail(clientModel: ClientsEntity, id: string): Promise<any> {
    const programModel = await this.programsRepository.findOne({
      where: {
        id: Number(id),
        clientId: clientModel.id,
      },
      select: [
        'segment',
        'reward',
        'endDate',
        'description',
        'startDate',
        'type',
        'name',
        'status',
        'id',
      ],
    });
    if (!programModel) {
      throw new BadRequestException('Không tìm thấy program');
    }
    const formatSegment = get(programModel.segment, 'conditions', []).map(
      (item) => {
        const [attr, logic, value] = get(item, 'value', '').split(' ');
        return {
          attr,
          logic: ENUM_PROGRAM_SEGMENT_LOGIC.EQUALS,
          value,
        };
      },
    );
    const formatReward = get(programModel, 'reward', []).map((item) => ({
      ...item,
      status: get(item, 'status') === ENUM_REWARD_STATUS.ACTIVATED,
    }));

    return {
      ...programModel,
      status: programModel.status === ENUM_LOYALTY_PROGRAM_STATUS.ACTIVATED,
      segment: formatSegment,
      reward: formatReward,
    };
  }

  async getRewardUrGift(
    clientModel: ClientsEntity,
    query: PaginationRequest,
  ): Promise<PaginationResponse<any>> {
    const { title, limit, skip } = query;
    const { campaignId } = clientModel;

    const campaignModel = await this.campaignRepository.findOne({
      where: {
        id: campaignId,
      },
    });
    if (isEmpty(campaignModel)) {
      throw new BadRequestException('Không tìm thấy campaign phù hợp');
    }
    const campaignParams = campaignModel?.params;
    const appId = get(campaignParams, 'appId');
    const appSecret = get(campaignParams, 'appSecret');
    if (!appId || !appSecret) {
      throw new BadRequestException('Không tìm thấy app phù hợp');
    }

    const giftList = this.urGiftService.getLists(
      appId,
      Number(skip),
      Number(limit),
      title,
    );
    return giftList;
  }

  async getSubPoByCampaignId(
    clientModel: ClientsEntity,
  ): Promise<GetSubPOByCampaignIdResponseDTO[]> {
    const { campaignId } = clientModel;
    const subPOs = await this.subPurchaseOrderService.FindAllSubPOByCampaignId({
      campaignId,
    });
    return subPOs;
  }

  async getListGiftSet(clientModel: ClientsEntity): Promise<any> {
    const { campaignId } = clientModel;

    const campaignModel = await this.campaignRepository.findOne({
      where: {
        id: campaignId,
      },
    });
    if (isEmpty(campaignModel)) {
      throw new BadRequestException('Không tìm thấy campaign phù hợp');
    }
    const ruleModel = await this.ruleRepository.findOne({
      where: {
        campaignId,
      },
    });
    if (isEmpty(ruleModel)) {
      throw new BadRequestException('Không tìm thấy rule');
    }
    const listGiftSet = get(ruleModel, 'rule.gift_set_config.gift_set', []);
    // get id and remove null id
    const listGiftSetId = compact(
      listGiftSet.map((item) => get(item, 'id', null)),
    );
    if (!isArray(listGiftSet) || !listGiftSet.length) {
      return [];
    }
    const giftSetInfo = await Promise.all(
      listGiftSetId.map(async (id) => {
        const giftModel = await this.giftRepository.findOne({
          where: {
            id,
          },
        });
        if (isEmpty(giftModel)) {
          throw new BadRequestException('Không tìm thấy gift');
        }
        return {
          id,
          name: giftModel?.name,
        };
      }),
    );
    return {
      data: giftSetInfo,
    };
  }

  async create(
    clientModel: ClientsEntity,
    @Body() body: CreateProgramDTO,
    createdBy: string,
  ): Promise<any> {
    const [validSegment, validReward] = await Promise.all([
      await this.validProgramSegments({
        programType: body.type,
        segments: body.segment,
        client: clientModel,
      }),
      await this.validProgramRewards({
        rewards: body.reward,
        client: clientModel,
      }),
    ]);
    if (!validReward || !validSegment) {
      throw new BadRequestException('Dữ liệu truyền lên không đúng');
    }

    // TODO: nếu có OR trong phase 2 có lẽ phải sửa lại phần này
    const formatSegments: SegmentConditionNode = {
      type: ENUM_PROGRAM_SEGMENT_TYPE_CONDITION_NODE.AND,
      conditions: body.segment.map((segment) => ({
        type: ENUM_PROGRAM_SEGMENT_TYPE_CONDITION_NODE.LEAF,
        value: `${segment.attr} = ${segment.value}`,
      })),
    };
    const formatRewards = body.reward.map((item) => {
      if (
        item.mechanism.durationType ===
        ENUM_PROGRAM_REWARD_MECHANISM_DURATION_TYPE.DAILY
      ) {
        unset(item.mechanism, 'day');
      }
      return {
        ...item,
        rewardId: uuidv4(),
      };
    });
    const { startDate, endDate } = body;

    await this.programsRepository.save({
      ...body,
      createdBy,
      endDate: dayjs(endDate).tz(TIMEZONE).endOf('days').toDate(),
      startDate: dayjs(startDate).tz(TIMEZONE).startOf('date').toDate(),
      clientId: clientModel.id,
      createdAt: new Date(),
      segment: formatSegments,
      reward: formatRewards,
    });

    return {
      success: true,
    };
  }

  async updateProgram(
    id: string,
    client: ClientsEntity,
    @Body() body: UpdateProgramDTO,
    updatedBy: string,
  ): Promise<any> {
    const { endDate, name, description, status } = body;
    let reward = body.reward;

    const programModel = await this.programsRepository.findOne({
      where: {
        id: Number(id),
        clientId: client.id,
      },
    });
    if (!programModel) {
      throw new BadRequestException('Không tìm thấy chương trình nào');
    }
    // check endDate > startDate
    if (
      endDate &&
      (dayjs(programModel.startDate).isAfter(endDate) ||
        dayjs(endDate).isBefore(dayjs()))
    ) {
      throw new BadRequestException(
        'Dữ liệu ngày kết thúc truyền lên không đúng',
      );
    }
    const oldReward = slice(reward, 0, programModel.reward.length);
    const newReward = slice(reward, programModel.reward.length);

    /**
     * Đối với reward cũ
     * - Chỉ cho phép edit các trường nhất định, và không được xoá
     */
    const existedNewRewardSuitableCurrent = oldReward.filter(
      (oldRewardItem) => {
        return programModel.reward.find((currentRewardItem) => {
          return isEqual(
            omit(
              oldRewardItem,
              REWARD_VALUE_ALLOW_TO_EDIT_FOR_PROGRAM_TYPE[oldRewardItem.type],
            ),
            omit(
              currentRewardItem,
              REWARD_VALUE_ALLOW_TO_EDIT_FOR_PROGRAM_TYPE[
                currentRewardItem.type
              ],
            ),
          );
        });
      },
    );
    if (
      existedNewRewardSuitableCurrent.length !==
      get(programModel, 'reward', []).length
    ) {
      throw new BadRequestException(
        'Các đặc quyền cũ tồn tại thay đổi không cho phép hoặc đã bị xoá',
      );
    }

    /**
     * Đối với reward mới (nếu có)
     * - Valid reward
     * - Check trùng đối với type giftset + brand_voucher, cho phép trùng với up_point
     */
    const validNewReward = newReward.length
      ? await this.validProgramRewards({
          rewards: newReward,
          client,
        })
      : true;
    if (!validNewReward) {
      throw new BadRequestException('Các đặc quyền mới config không đúng');
    }
    const existDuplicate = newReward.filter((rewardItem) => {
      if (rewardItem.type === ENUM_REWARD_TYPE.UP_POINT) return false;

      return oldReward.find(
        (oldRewardItem) =>
          oldRewardItem.rewardName.key === rewardItem.rewardName.key,
      );
    });
    if (!isEmpty(existDuplicate)) {
      const message = existDuplicate
        .map((item) => item.rewardName.label)
        .join(',');
      throw new BadRequestException(
        `Các đặc quyền ${message} không được phép trùng`,
      );
    }

    /**
     * update rewardId nếu chưa có
     */
    reward = body.reward.map((rewardItem) => ({
      ...rewardItem,
      ...(get(rewardItem, 'rewardId') ? {} : { rewardId: uuidv4() }),
    }));

    await this.programsRepository.update(
      {
        id: Number(id),
        clientId: client.id,
      },
      {
        name,
        description,
        status,
        updatedBy,
        updatedAt: new Date(),
        endDate: endDate || programModel.endDate,
        reward: reward as any,
      },
    );

    return true;
  }

  async validProgramRewards({
    rewards,
    client,
  }: {
    client: ClientsEntity;
    rewards: ProgramRewardDTO[];
  }): Promise<boolean> {
    if (isEmpty(rewards)) {
      throw new BadRequestException('Không tồn tại đặc quyền');
    }
    for (const reward of rewards) {
      const rewardType = reward.type;
      if (rewardType === ENUM_REWARD_TYPE.UP_POINT) {
        const subPOId = reward.rewardName.key;
        const upPointAmount = reward.quantity;

        const subPOs = await this.getSubPoByCampaignId(client);
        const infoSubPO = subPOs.find((item) => item.subPOId === subPOId);
        if (!infoSubPO) {
          throw new BadRequestException('Không tồn tại subPO');
        }
        if (Number(infoSubPO.availableAmount) < Number(upPointAmount)) {
          throw new BadRequestException(
            'Điểm UP không được lớn hơn số tiền trong subPO',
          );
        }
      }

    
    }
    return true;
  }

  async validProgramSegments({
    programType,
    client,
    segments,
  }: {
    programType: ENUM_LOYALTY_PROGRAM_TYPE;
    client: ClientsEntity;
    segments: ProgramSegmentDTO[];
  }): Promise<boolean> {
    const uniqueSegments = uniqWith(
      segments.map((segment) => segment.attr),
      isEqual,
    );
    if (uniqueSegments.length !== segments.length) {
      throw new BadRequestException('Không được chứa các điều kiện trùng lặp');
    }
    //#region check xem segment attr có hợp lệ ứng với từng program type không
    const listSegmentAttr = LIST_SEGMENT_FOR_PROGRAM_TYPE[programType];
    if (isEmpty(listSegmentAttr)) {
      throw new BadRequestException('Không có điều kiện nào hợp lệ');
    }
    // check các điều kiện dư không được phép xuất hiện
    const segmentNotAllowExist = differenceBy(
      segments.map((item) => item),
      listSegmentAttr.map((item) => item),
      'attr',
    );
    if (!isEmpty(segmentNotAllowExist)) {
      const formatAttr = join(map(segmentNotAllowExist, 'attr'), ',');
      throw new BadRequestException(
        `Các điều kiện ${formatAttr} không cho phép ở program ${programType}`,
      );
    }

    //  filter ra những attr bắt buộc có của những program type
    const requireSegmentAttrNotFound = without(
      listSegmentAttr.filter((item) => item.required).map((item) => item.attr),
      ...segments.map((item) => item.attr),
    );
    if (!isEmpty(requireSegmentAttrNotFound)) {
      throw new BadRequestException(
        `Điều kiện áp dụng thiếu ${join(requireSegmentAttrNotFound, ',')}`,
      );
    }

    for (const segment of segments) {
      if (segment.attr === ENUM_PROGRAM_SEGMENT_ATTR.CLIENT_SOURCE) {
        if (segment.value !== client.code)
          throw new BadRequestException(
            `${ENUM_PROGRAM_SEGMENT_ATTR.CLIENT_SOURCE} không tồn tại`,
          );
      }

      if (segment.attr === ENUM_PROGRAM_SEGMENT_ATTR.USER_TIER) {
        const tiersModel = await this.tiersRepository.find({
          where: {
            clientId: client.id,
            status: ENUM_LOYALTY_TIER_STATUS.ACTIVATED,
          },
        });
        const isExisted = tiersModel.find(
          (tier) => tier.alias === segment.value,
        );
        if (isEmpty(isExisted)) {
          throw new BadRequestException(
            `${ENUM_PROGRAM_SEGMENT_ATTR.USER_TIER} không tồn tại hoặc không hoạt động`,
          );
        }
      }
    }

    return true;
  }
}
