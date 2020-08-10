import React from 'react';
import { Button, Card, Layout, Modal, Text } from '@ui-kitten/components';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { StyleSheet, View, Alert } from "react-native";

export default class QRScanScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            onReadFoundStudent: false,
            onReadNotFoundStudent: false,
            enrollments: [],
            scannedStudent: null,
        }

    }

    async componentDidMount() {
        const { route } = this.props;
        await this.setState({enrollments: route.params.enrollments});
    }

    async checkIfStudentIsEnrolled(enrollmentId) {
        let enrollment = await this.state.enrollments.find(enrollment => enrollmentId === enrollment.StudentId);
        console.log("Enrollment", enrollment);
        if (enrollment !== null && enrollment !== undefined) this.setState({onReadFoundStudent: true, scannedStudent: enrollment});
        else this.setState({onReadNotFoundStudent: true});
    }

    markStudent() {
        this.props.route.params.checkStudentById(this.state.scannedStudent.StudentId);
        this.toggleFoundModalOff();
    }

    toggleFoundModalOff() {  this.setState({onReadFoundStudent: false, scannedStudent: null}) }

    toggleNotFoundModalOff() { this.setState({onReadNotFoundStudent: false}) };

    onScannerRead(scannedMessage) {
        console.log("[QR-Scanner | On Read] ", scannedMessage);
        this.checkIfStudentIsEnrolled(scannedMessage);
    }

    render() {

        const foundStudentModal = () => (
            (
                this.state.scannedStudent && 
                <Modal visible={this.state.onReadFoundStudent} style={styles.popOverContent}>
                    <Card disabled={true} status="success">
                        <Text style={{marginVertical: 15, alignSelf: 'center'}} category={'s1'} status="success">Student Found</Text>
                        <Text style={{marginBottom: 15, alignSelf: 'center'}}>{this.state.scannedStudent.StudentName}</Text>
                        <View style={{flexDirection:'row', flex:1, width: 300}}>
                            <View style={{flexDirection:'column', flex:1}}>
                                <Button appearance='outline' size={'small'} onPress={() => this.toggleFoundModalOff()} status="basic">
                                    Cancel
                                </Button>
                            </View>
                            <View style={{flexDirection:'column', flex: 1}}>
                                <Button appearance='outline' size={'small'} onPress={() => this.markStudent()} status="success">
                                    Update
                                </Button>
                            </View>
                        </View>
                    </Card>
                </Modal>
            )
        );

        const notFoundStudentModal = () => (
            <Modal visible={this.state.onReadNotFoundStudent} style={styles.popOverContent}>
                <Card disabled={true} status="danger">
                    <Text style={{marginVertical: 15, alignSelf: 'center'}} category={'s1'} status="danger">Student not found</Text>
                    <Text style={{marginBottom: 15, alignSelf: 'center'}}>The student is not enrolled or does not exist.</Text>
                    <View style={{flexDirection:'row', flex:1, width: 300}}>
                        <View style={{flexDirection:'column', flex: 1}}>
                            <Button appearance='outline' size={'small'} onPress={() => this.toggleNotFoundModalOff()} status="danger">
                                OK
                            </Button>
                        </View>
                    </View>
                </Card>
            </Modal>
        );

        return(
            <Layout style={{flex:1}}>
                {foundStudentModal()}
                {notFoundStudentModal()}
                <QRCodeScanner
                    onRead={message => this.onScannerRead(message)}
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
}

const styles = StyleSheet.create({
    popOverContent: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf:'center',
        shadowRadius: 10,
        shadowOpacity: 0.12,
        shadowColor: "#000"
    }
});