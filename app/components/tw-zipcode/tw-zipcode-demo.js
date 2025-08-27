import { useState } from 'react'
import TWZipCode from '@/components/tw-zipcode'

function Demo() {
  const [data, setData] = useState({
    country: '高雄市',
    township: '鳳山區',
    postcode: '830',
  })

  return (
    <>
      {/* 無props測試 */}
      <TWZipCode />
      {/* 給定初始化postcode */}
      <TWZipCode
        initPostcode="100"
        onPostcodeChange={(country, township, postcode) => {
          console.log(country, township, postcode)
        }}
      />
      {/* 與本元件state相接與初始化 */}
      <TWZipCode
        initPostcode={data.postcode}
        onPostcodeChange={(country, township, postcode) => {
          setData({
            country,
            township,
            postcode,
          })
        }}
      />
    </>
  )
}

export default Demo
