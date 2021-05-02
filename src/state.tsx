import {atom, useRecoilState} from 'recoil'

const currentColor = atom({
  key: 'currentColor',
  default: '#000000'
})

export function useCurrentColor() {
  return useRecoilState(currentColor)
}
