import React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { map } from "./Map";

export default function MapView(props) {
  const mapRef = React.useRef(null);

  React.useEffect(() => {
    props.location.lat != null &&
      props.location.lon != null &&
      mapRef?.current?.postMessage(
        `loc${props.location.lat}$${props.location.lon}`
      );
  }, [props.location]);

  return (
    <View flex={1}>
      <WebView
        ref={mapRef}
        javaScriptEnabled={true}
        source={{ html: map }}
        originWhitelist={["*"]}
        // setSupportMultipleWindows={true}
        setJavaScriptCanOpenWindowsAutomatically={true}
        javaScriptCanOpenWindowsAutomatically={true}
        onError={console.error.bind(console, "error")}
        allowFileAccess={true}
        allowingReadAccessToURL={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode={"always"}
        cacheEnabled={true}
        scalesPageToFit={true}
        domStorageEnabled={true}
        userAgent={"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"}   
      />
    </View>
  );
}
