import FcmTokenComp from '../utils/hooks/firebaseForeground';

function fcmComp({ Component, pageProps }) {
  return (
    <div>
      <FcmTokenComp /> 
      <Component {...pageProps} />
    </div>
  );
}