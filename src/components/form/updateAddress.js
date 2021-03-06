import React from "react";
import { Form, Icon, Input, Button, Tooltip, message, Modal } from 'antd';
import { Auth, I18n } from 'aws-amplify';
import dict from "../dictionary/dictionary";
import * as mutations from "../../graphql/mutations";
import * as queries from "../../graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';
import { getLanguage } from "../../services/auth";
import "../../style/userProfile.css";

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
    class extends React.Component {
        render() {
            const {
                visible, onUpdate, onCancel, form
            } = this.props;
            const { getFieldDecorator } = form;
            return (
                <Modal
                    visible={visible}
                    title={I18n.get("Update Your Address")}
                    okText={I18n.get("Update")}
                    cancelText={I18n.get("Cancel")}
                    onCancel={onCancel}
                    onOk={onUpdate}
                >
                    <Form layout="vertical">
                        <Form.Item label={I18n.get("Line 1")}>
                            {getFieldDecorator('line1')(
                                <Input placeholder={I18n.get('Enter the first line of the street address')}
                                    name="line1"
                                    suffix={
                                        <Tooltip title={I18n.get('Enter the first line of the street address')}>
                                            <Icon type="info-circle" />
                                        </Tooltip>}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={I18n.get("Line 2")}>
                            {getFieldDecorator('line2')(
                                <Input placeholder={I18n.get('Enter the second line of the street address')}
                                    name="line2"
                                    suffix={
                                        <Tooltip title={I18n.get('Enter the second line of the street address')}>
                                            <Icon type="info-circle" />
                                        </Tooltip>}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={I18n.get("City")}>
                            {getFieldDecorator('city')(
                                <Input placeholder={I18n.get('Enter the name of the city')}
                                    name="city"
                                    suffix={
                                        <Tooltip title={I18n.get('Enter the name of the city')}>
                                            <Icon type="info-circle" />
                                        </Tooltip>}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={I18n.get("Postal Code")}>
                            {getFieldDecorator('postalCode')(
                                <Input placeholder={I18n.get('Enter the postal code')}
                                    name="postalCode"
                                    suffix={
                                        <Tooltip title={I18n.get('Enter the postal code')}>
                                            <Icon type="info-circle" />
                                        </Tooltip>}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label={I18n.get("State")}>
                            {getFieldDecorator('state')(
                                <Input placeholder={I18n.get('Enter the name of the state')}
                                    name="state"
                                    suffix={
                                        <Tooltip title={I18n.get('Enter the name of the state')}>
                                            <Icon type="info-circle" />
                                        </Tooltip>}
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)
/**
 * The class UpdateAddressForm will render the Update Address form.
 * It will give the user the ability to update the current address
 * on their profile, if they have one.
 */
class UpdateAddressForm extends React.Component {
    state = {
        visible: false,
        lan: getLanguage()
    }
    /**
     * hide or show the form
     */
    showModal = () => {
        this.setState({ visible: true })
    }
    /**
     * handle a click of the cancel button on the form
     */
    handleCancel = () => {
        this.setState({ visible: false })
    }

    // api call to update address function
    /**
     * use the API to update the address
     */
    handleUpdate = async () => {
        const form = this.formRef.props.form;
        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            let user = await Auth.currentAuthenticatedUser();
            const { attributes } = user;
            console.log("These values were entered: ", values);
            const updateAddInput = {
                id: attributes.sub,
                line1: values["line1"],
                line2: values["line2"],
                city: values["city"],
                postalCode: values["postalCode"],
                state: values["state"]
            }
            try {
                const updateAddress = await API.graphql(graphqlOperation(mutations.updateAddress, { input: updateAddInput }));
                console.log('success updating address', updateAddress);
                message.success(`Success Updating Address!`);
            }
            catch (err) {
                console.log("error in updating address");
                message.error("Error in Updating Address");
            }
            form.resetFields();
            this.setState({ visible: false });
            window.location.reload();
        })
    }
    /**
     * save the values entered in the form
     */
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    /**
     * render the form on the sidebar
     */
    render() {
        I18n.putVocabularies(dict);
        I18n.setLanguage(this.state.lan);
        return (
            <div>
                <Button className='modify-info-button' ghost onClick={this.showModal}>
                <Icon type="home" theme="twoTone" twoToneColor="#52c41a"/>{I18n.get('Update Your Address')}</Button>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onUpdate={this.handleUpdate}
                />
            </div>
        )
    }
}

export default UpdateAddressForm;