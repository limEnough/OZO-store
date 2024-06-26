import { inject, onMounted, reactive } from 'vue';
import MemberLoginService, { type MemberLoginForm } from '@/services/member/login';
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
import createCustomField, { createValidationSchema } from '@/composables/use/use-custom-field';
import { isEmpty } from '@/utils/validator';
import formConfig from '@/configs/form.config';
import { ALLOWED_REGEXS } from '@/constants/regex.constants';
import type { CheckboxModel } from '@/types/common.types';
import { SAVE_EMAIL_COOKIE } from '@/constants/member-constants';
import type { VueCookies } from 'vue-cookies';
import { useLayoutStore } from '@/stores/layout';
import { useRedirect } from '@/composables/use/use-redirect';

interface LoginForm extends MemberLoginForm {
  useSaveEmail: CheckboxModel<boolean>;
}

export default function loginComposable() {
  const messages = useI18n();
  const layoutStore = useLayoutStore();
  const { redirectToMyMain } = useRedirect();

  // #region Form
  const { handleSubmit: veeHandleSubmit, resetForm: veeResetForm } = useForm<LoginForm>();

  const validationSchema = createValidationSchema<LoginForm>({
    email: (value: LoginForm['email']) => {
      if (isEmpty(value)) {
        return messages.t('validation.requiredItem', { name: '이메일' });
      }
      return true;
    },
    password: (value: LoginForm['password']) => {
      if (isEmpty(value)) {
        return messages.t('validation.requiredItem', { name: '비밀번호' });
      }
      return true;
    },
  });
  // #endregion

  // #region fields
  const email = reactive(
    createCustomField<LoginForm['email']>(
      'email',
      validationSchema.email,
      {
        initialValue: '',
      },
      {
        max: formConfig.max.email,
        regex: ALLOWED_REGEXS.ALL_KEYBOARD_CHARACTERS,
      },
    ),
  );

  const password = reactive(
    createCustomField<LoginForm['password']>(
      'password',
      validationSchema.password,
      {
        initialValue: '',
      },
      {
        max: formConfig.max.password,
        regex: ALLOWED_REGEXS.ALL_KEYBOARD_CHARACTERS,
      },
    ),
  );

  const useSaveEmail = reactive(
    createCustomField<LoginForm['useSaveEmail']>('useSaveEmail', undefined, {
      initialValue: true,
    }),
  );
  // #endregion

  // #region Api
  const pageService = new MemberLoginService();
  const $cookies = inject<VueCookies>('$cookies') as VueCookies;

  const login = async (values: LoginForm) => {
    const params: MemberLoginForm = { email: values.email, password: values.password };
    const result = await pageService.authLogin(params);

    if (typeof result !== 'object') {
      alert(result);
      return false;
    }

    // 로그인 정보 로컬스토리지에 저장하기
    layoutStore.saveAuth({ authToken: result.authToken, expirationTime: result.expirationTime });

    // '이메일 저정하기' 쿠키 설정
    if (values.useSaveEmail) {
      $cookies.set(SAVE_EMAIL_COOKIE['KEY'], result.email, SAVE_EMAIL_COOKIE['MAXAGE']);
    } else {
      $cookies.remove(SAVE_EMAIL_COOKIE['KEY']);
    }

    return true;
  };
  // #endregion

  // #region Events
  const onValidSuccess = async (values: LoginForm) => {
    const result = await login(values);

    if (!result) return;

    alert('환영합니다!');

    redirectToMyMain();
  };

  const onValidFail = () => {
    alert(email.errorMessage.length ? email.errorMessage : password.errorMessage);
  };

  const handleSubmit = veeHandleSubmit(onValidSuccess, onValidFail);
  // #endregion

  onMounted(() => {
    // 이메일 저장한 쿠키 정보 있는지 확인
    const getSavedEmail = $cookies.get(SAVE_EMAIL_COOKIE['KEY']);

    if (getSavedEmail) {
      veeResetForm({
        values: {
          email: getSavedEmail,
          password: '',
          useSaveEmail: true,
        },
      });
    }
  });

  return {
    email,
    password,
    useSaveEmail,
    handleSubmit,
  };
}
