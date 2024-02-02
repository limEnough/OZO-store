import { type RouteRecordRaw } from 'vue-router';
import { PAGE_CODE_DEPTH1, PAGE_CODE_DEPTH2 } from '@/constants/page-code-constants';
import { MEMBER_PAGE_NAMES } from '@/constants/path-constants';
import Login from '@/views/member/login/index.vue';

const getMainRoutes = (): RouteRecordRaw[] => {
  return [
    {
      path: '/member',
      name: MEMBER_PAGE_NAMES['member'],
      redirect: '/member/login',
      meta: {
        pageTitle: '로그인',
        pageCode: PAGE_CODE_DEPTH1['MEMBER'],
      },
      children: [
        {
          path: '/member/login',
          name: MEMBER_PAGE_NAMES['member-login'],
          component: Login,
          meta: {
            pageTitle: '로그인',
            pageCode: PAGE_CODE_DEPTH2['LOGIN'],
          },
        },
      ],
    },
  ];
};

export default getMainRoutes;
