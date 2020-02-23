import { getValidators, isValidUsername, lessThan, required } from '@/utils/validate'
const formRules = {
  username: getValidators([
    {
      message: '账号不能为空!',
      include: required
    },
    {
      message: '不能少于5个字符!',
      include: lessThan(5)
    },
    {
      message: '账号格式不正确!',
      exclude: isValidUsername
    }
  ]),
  password: getValidators([
    {
      message: '密码不能为空!',
      include: required
    }
  ])
}
export default formRules
