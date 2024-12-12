import React, { useEffect } from 'react';
import { Avatar, Col, Divider, Dropdown, Form, Layout, MenuProps, Row, Space } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import Image from 'next/image';
import get from 'lodash/get';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { SearchCampaignsUrstaff } from 'apis/urstaff-portal-web/campaign';
import { GenerateToken } from 'apis/urstaff-portal-web/generate-token';
import { urStaffPathNames } from 'constants/urstaff-portal-web/pathName';
import { logOut } from 'functions/urstaff-portal-web/auth';

import { DebounceSelect } from 'components/urstaff-portal-web/DebounceSelect';
import { STORAGE_KEY } from 'constants/urstaff-portal-web/storage';
import { IAuthenticationUserType } from 'types/urstaff-portal-web/auth';

const { Header } = Layout;

interface MainHeaderProps {
  headerRef: React.Ref<HTMLDivElement>;
  authUser: IAuthenticationUserType;
  setAuthUser: (user: IAuthenticationUserType) => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({ headerRef, authUser, setAuthUser }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const campaign = Form.useWatch(['campaign'], form) || '';

  const storeCampaign = authUser?.campaign;
  const storePublisher = authUser?.publisher;

  const onLogout = async () => {
    try {
      await logOut(router);
    } catch (err) {
      console.error(err);
    }
  };

  const onChangePassword = () => {
    router.push(urStaffPathNames.CHANGE_PASSWORD);
  };

  const items: MenuProps['items'] = [
    {
      key: 'changePassword',
      label: t('ChangePassword'),
      onClick: onChangePassword,
    },
    {
      key: 'logout',
      label: t('Logout'),
      onClick: onLogout,
    },
  ];

  useEffect(() => {
    if (storeCampaign) {
      form.setFieldValue('campaign', {
        value: storeCampaign?.id,
        label: storeCampaign?.title,
        init: true,
      });
    }
  }, [form, storeCampaign]);
  useEffect(() => {
    if (campaign && !campaign.init) {
      GenerateToken('urstaff', {
        publisherId: storePublisher?.id,
        campaignId: campaign.value,
      }).then((value) => {
        setAuthUser({
          campaign: { id: campaign.value, title: campaign.title },
          extraData: value.extraData,
        });
        localStorage.setItem(STORAGE_KEY.FEATHER_JWT, value?.token as string);
        router.push(urStaffPathNames.DASHBOARD);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign]);

  return (
    <Header className='header'>
      <Row align='middle' justify='space-between'>
       
        <Col>
          <Space align='center' ref={headerRef}>
            <Form
              layout='horizontal'
              initialValues={{
                campaign: {
                  value: storeCampaign?.id,
                  label: storeCampaign?.title,
                  init: true,
                },
              }}
              form={form}
            >
              <Form.Item style={{ marginBottom: 0 }} name='campaign' label={t('Campaign')}>
                <DebounceSelect
                  style={{ width: 279 }}
                  showSearch
                  placeholder=''
                  fetchOptions={(search, additionSearch, page) =>
                    SearchCampaignsUrstaff(search, additionSearch, page, storePublisher?.id)
                  }
                />
              </Form.Item>
            </Form>
            <Divider type='vertical' style={{ height: 32 }} />
            <Dropdown
              overlayStyle={{ minWidth: 120 }}
              menu={{ items }}
              placement='bottomRight'
              trigger={['click']}
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{
                    backgroundColor: '#720D5D',
                    textTransform: 'uppercase',
                    verticalAlign: 'middle',
                  }}
                >
                  {get(authUser, 'publisher.title', ' ').charAt(0) || ''}
                </Avatar>
                <CaretDownOutlined style={{ color: '#720D5D', marginLeft: 5 }} />
              </Space>
            </Dropdown>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default MainHeader;
