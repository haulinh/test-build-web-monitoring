import en from './en'
import vi from './vi'
import { getListLanguages } from 'api/languageApi'

export async function getData() {
  const res = await getListLanguages()
  console.log(res, '--getdata--')
}
export default function getLanguage() {
  //fetchA API
  return { en, vi }
}
// export default { en, vi }
