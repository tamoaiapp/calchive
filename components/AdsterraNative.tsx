'use client'

import Script from 'next/script'

const NATIVE_KEY = '3ef1dc52f07efa8d5065504959252932'

/**
 * Adsterra Native Banner — ad that mimics content. Best placement is
 * mid-content or after the main result block.
 */
export default function AdsterraNative() {
  return (
    <div style={{ margin: '1.5rem auto', textAlign: 'center' }} aria-label="Advertisement">
      <Script
        id="adsterra-native-loader"
        strategy="afterInteractive"
        async
        data-cfasync="false"
        src={`https://pl29450474.profitablecpmratenetwork.com/${NATIVE_KEY}/invoke.js`}
      />
      <div id={`container-${NATIVE_KEY}`} />
    </div>
  )
}
