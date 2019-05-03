import {
    Button, Modal, Form, Input, Radio, Upload, Icon
} from 'antd';
import React from 'react';
// import Photo from "./photo.js";
import './photo.css';
import { Auth, Storage } from 'aws-amplify';

const UploadForm = Form.create({ name: 'upload_photo' })(
    // eslint-disable-next-line
    class extends React.Component {
        render() {
            const {
                visible, onCancel, onCreate, form,
                onFormCancel, onFormPreview, onFormChange, onFormDummy, onFormUpload,
                formPreviewVisible, formPreviewImage, formFileList
            } = this.props;
            const { getFieldDecorator } = form;
            console.log(formFileList);
            const uploadButton = (
                <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                </div>
            );
            return (
                <Modal
                    visible={visible}
                    title="Upload A New Profile Picture"
                    okText="Done"
                    cancelText="Back to Default"
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    {/* <Form layout="vertical">
                        <Form.Item label="Photo">
                            {getFieldDecorator('file', {
                                initialValue: formFileList && formPreviewImage ? formPreviewImage : [],
                                valuePropName: 'fileList',
                                getValueFromEvent: onFormChange,
                                rules: [{ required: true, message: 'Please upload a photo!' }],
                            })(
                                <div className="clearfix">
                                    <Upload
                                        listType="picture-card"
                                        onPreview={onFormPreview}
                                        customRequest={onFormDummy}
                                    >
                                        {/* {formFileList.length >= 1 ? null : uploadButton} 
                                        {uploadButton}
                                    </Upload>
                                    <Modal visible={formPreviewVisible} footer={null} onCancel={onFormCancel}>
                                        <img alt="example" style={{ width: '100%' }} src={formPreviewImage} />
                                    </Modal>
                                </div>
                            )}
                        </Form.Item>
                    </Form> */}
                    <div className="clearfix">
                        <Upload
                            //action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // TODO thsi is mocking action
                            customRequest={onFormUpload}
                            listType="picture-card"
                            fileList={formFileList}
                            onPreview={onFormPreview}
                            onChange={onFormChange}
                        >
                            {formFileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={formPreviewVisible} footer={null} onCancel={onFormCancel}>
                            <img alt="example" style={{ width: '100%' }} src={formPreviewImage} />
                        </Modal>
                    </div>
                </Modal>
            );
        }
    }
);

class UploadPage extends React.Component {
    state = {
        visible: false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
    };
    // for the form
    handleDummy = (file) => {
        console.log('this is dummy', file.file);
    }

    handleUpload = (file) => {
        const pic = file.file;
        Storage.put(pic.name, pic, {
            level: 'protected',
            contentType: pic.type
        })
            .then((result) => {
                console.log(result)
            })
            .catch(err => console.log(err));

    }

    handleFormCancel = () => this.setState({ previewVisible: false })

    handleFormPreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleFormChange = ({ file, fileList }) => {
        // console.log('file', file);
        this.setState({ fileList })
    }
    // end for the form

    showModal = () => {
        this.setState({ visible: true });
    }
    // TODO should make this set back to default
    handleCancel = () => {
        this.setState({ visible: false });
    }
    // this below function will pretty much useless
    // TODO need to write another upload function
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ visible: false });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Upload A New Profile Picture</Button>
                <UploadForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    onFormCancel={this.handleFormCancel}
                    onFormPreview={this.handleFormPreview}
                    onFormChange={this.handleFormChange}
                    onFormDummy={this.handleDummy}
                    onFormUpload={this.handleUpload}
                    formPreviewVisble={this.state.previewVisible}
                    formPreviewImage={this.state.previewImage}
                    formFileList={this.state.fileList}
                />
            </div>
        );
    }
}

export default UploadPage;