import React from 'react'
import { Oval } from 'react-loader-spinner'

export default function Loader() {
  return (
    <Oval
      height={60}
      width={60}
      color="#4fa94d"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="#435585"
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
  )
}
