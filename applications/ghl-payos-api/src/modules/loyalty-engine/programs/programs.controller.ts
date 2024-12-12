import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RequestMerchant } from 'src/shared/decorators/request-merchant.decorator';
import { KeyCloakLoyaltyGuard } from 'src/shared/guards/keycloak-loyalty.guard';
import { PaginationResponse } from 'src/shared/pagination-response';
import { CreateProgramDTO } from './dto/create-program-request.dto';
import { GetProgramRequestDTO } from './dto/get-program-request.dto';
import { GetProgramDTO } from './dto/get-program-response.dto';
import { GetSubPOByCampaignIdResponseDTO } from './dto/get-subpo-by-campaign-id-response.dto';
import { PaginationRequest } from './dto/pagination-request.dto';
import { UpdateProgramDTO } from './dto/update-program-request.dto';
import { LoyaltyEngineProgramsService } from './programs.service';

@Controller('loyalty-engine/programs')
export class LoyaltyEngineProgramsController {
  constructor(private readonly programsService: LoyaltyEngineProgramsService) {}

  @UseGuards(KeyCloakLoyaltyGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get()
  async get(
    @RequestMerchant() { client }: any,
    @Query() query: GetProgramRequestDTO,
  ): Promise<GetProgramDTO[]> {
    return this.programsService.get(client, query);
  }

  @UseGuards(KeyCloakLoyaltyGuard)
  @Get('/:id')
  async getDetail(
    @RequestMerchant() { client }: any,
    @Param('id') id: string,
  ): Promise<GetProgramDTO> {
    return this.programsService.getDetail(client, id);
  }

  @UseGuards(KeyCloakLoyaltyGuard)
  @Get('/reward/urgifts/list')
  async getRewardUrGift(
    @RequestMerchant() { client }: any,
    @Query() query: PaginationRequest,
  ): Promise<PaginationResponse<any>> {
    return this.programsService.getRewardUrGift(client, query);
  }

  @UseGuards(KeyCloakLoyaltyGuard)
  @Get('/reward/urgifts')
  async getListGiftSet(
    @RequestMerchant() { client }: any,
    @Query() query: PaginationRequest,
  ): Promise<PaginationResponse<any>> {
    return this.programsService.getListGiftSet(client);
  }

  @UseGuards(KeyCloakLoyaltyGuard)
  @Get('/reward/sub-po')
  async getSubPoByCampaignId(
    @RequestMerchant() { client }: any,
  ): Promise<GetSubPOByCampaignIdResponseDTO[]> {
    return this.programsService.getSubPoByCampaignId(client);
  }

  @UseGuards(KeyCloakLoyaltyGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  )
  @Post()
  async create(
    @RequestMerchant() { client, email }: any,
    @Body() body: CreateProgramDTO,
  ): Promise<any> {
    const createdBy = email;
    return this.programsService.create(client, body, createdBy);
  }

  @UseGuards(KeyCloakLoyaltyGuard)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  )
  @Patch('/:id')
  async updateProgram(
    @Param('id') id: string,
    @Body() body: UpdateProgramDTO,
    @RequestMerchant() { client, email }: any,
  ): Promise<any> {
    return this.programsService.updateProgram(id, client, body, email);
  }
}
