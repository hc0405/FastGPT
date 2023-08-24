import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Cookies from 'js-cookie';

export const LANG_KEY = 'NEXT_LOCALE_LANG';
export enum LangEnum {
  'zh' = 'zh',
  'en' = 'en',
  'zh_TW' = 'zh_TW'
}

export const setLangStore = (value: `${LangEnum}`) => {
  return Cookies.set(LANG_KEY, value, { expires: 7, sameSite: 'None', secure: true });
};

export const getLangStore = () => {
  return (Cookies.get(LANG_KEY) as `${LangEnum}`) || LangEnum.zh_TW;
};

export const serviceSideProps = (content: any) => {
  return serverSideTranslations(
    content.req.cookies[LANG_KEY] || 'zh_TW',
    undefined,
    null,
    content.locales
  );
};
