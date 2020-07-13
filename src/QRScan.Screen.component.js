import React from 'react';
import { Layout, Text } from '@ui-kitten/components';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

export default QRScanScreen = ({navigation}) => {
    return(
        <Layout style={{flex:1}}>
            <QRCodeScanner
                onRead={e=>{console.log("message readed", e)}}
                flashMode={RNCamera.Constants.FlashMode.torch}
                reactivate={true} //Let us scan as many qr code as we want
                reactivateTimeout={1}
                topContent={
                    <Text>
                        Scan student`s QR code for checking his attendance
                    </Text>
                }
            />
        </Layout>
    );
}