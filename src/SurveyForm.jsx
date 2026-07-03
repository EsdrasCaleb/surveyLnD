import React, { useState,useEffect,useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, Card, FloatButton, Popconfirm, Image, Form, Input, Button, Checkbox, Space, Select, Radio, InputNumber } from 'antd';
import installIdImg from './assets/install-id-location.png';
import { CloseOutlined } from '@ant-design/icons';
import RequiredFieldsSummary from "./RequiredFieldsSummary.jsx";
import {debounce, isEqual} from 'lodash';



const SurveyForm = ({ data, setData, uid, onAnswer }) => {
    const screens = Grid.useBreakpoint();
    const [currentScreen, setCurrentScreen] = useState(screens);
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [requiredErrors, setRequiredErrors] = useState([]);


    useEffect(() => {
        if (!isEqual(currentScreen, screens)) {
            setCurrentScreen(screens);
        }
    }, [screens]);

    const onFinish = async (values) => {
        setLoading(true)
        const dataCollums = ["language","form_language","time",
            "install_id", "unity_experience","project_used","project_used_other","automated_testing_experience",
            "automated_testing_experience_other","cloud_models","cloud_models_other","local_models",
            "local_models_other","easy_to_use","helped_create_tests","tests_required_few_changes","write_more_tests",
            "encouraged_pipeline","saved_time","helped_find_bugs","continue_using","recommend_tool","bugs_found_count",
            "bugs_found_example","software_engineering_areas","software_engineering_areas_other","why_useful",
            "greatest_benefit","greatest_problem","missing_feature","what_would_change"
        ]

        // Filtrar os valores para manter apenas as chaves de dataCollums
        const filteredValues = Object.fromEntries(
            dataCollums.map(key => [key, values[key]])
        );
        filteredValues['uid'] = uid;

        const body_request = JSON.stringify(filteredValues);

        const url = 'https://script.google.com/macros/s/AKfycbw1yksFMleKJR0GTe7LiHr7b3hHOAtY-LRaEi99h4AobNKBEvu-Q18vjRYdgdYyHK_6/exec';

        try {
            fetch(url, {
                method: 'POST',
                mode: "no-cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body_request
            }).then((response) => {
                console.log(response);
            })
                .then((data) => {
                    console.log("Success:", data)
                    onAnswer();
                        setLoading(false)
                }
                )
                .catch((error) => {console.error("Error:", error);setLoading(false)});
        } catch (error) {
            console.error('Erro ao enviar dados:', error.message);
            setLoading(false)
        }
    };
    let index = 1

    const [form] = Form.useForm();
    //initial data
    useEffect(() => {
        form.setFieldsValue(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [])

    //changeData
    const debouncedSetData = useMemo(
        () =>
            debounce((allValues) => {
                setData({...data,...allValues});
            }, 300),
        []
    );

    return (
        <Card >
        <Form
            form={form} layout="vertical" onFinish={onFinish}
            onValuesChange={(changed, all) => {
                debouncedSetData(all);
            }}
            onFinishFailed={({ errorFields }) => {
                const newErrors = errorFields.map(f => f.name.join('.'));
                setRequiredErrors(prev => {
                    if (isEqual(prev, newErrors)) return prev;
                    return newErrors;
                });
            }}
        >
            {data?.shareBrowser&&(<Form.Item name="language" initialValue={i18n.languages[0]} hidden>
                <Input value={i18n.languages[0]} type="hidden" />
            </Form.Item>)}
            <Form.Item name="time" initialValue={uid} hidden>
                <Input value={Math.floor(data.time)} type="hidden" />
            </Form.Item>
            <Form.Item name="form_language" initialValue={uid} hidden>
                <Input value={data.form_language} type="hidden" />
            </Form.Item>

            <Card type="inner" className="inner-card" title={t("survey.profile")} >
                <Space direction="vertical" style={{ width: "100%" }}>
                    <Image
                        src={installIdImg}
                        alt="Location of the Installation ID in Unity"
                        width={350}
                        style={{ marginBottom: 12 }}
                    />
                    <Form.Item name="install_id" label={(index++)+"-"+t('survey.install_id')} >
                        <Input />
                    </Form.Item>
                </Space>
                <Form.Item
                    name="unity_experience"
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                    label={(index++)+"-"+t('survey.unity_experience')}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    name="project_used"
                    label={(index++) + "-" + t('survey.project_used')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Checkbox.Group className="flex-column">
                        <Checkbox value="academic">{t('survey.project_types.academic')}</Checkbox>
                        <Checkbox value="hobby">{t('survey.project_types.hobby')}</Checkbox>
                        <Checkbox value="open-source">{t('survey.project_types.open-source')}</Checkbox>
                        <Checkbox value="commercial-small">{t('survey.project_types.commercial-small')}</Checkbox>
                        <Checkbox value="commercial-medium">{t('survey.project_types.commercial-medium')}</Checkbox>
                        <Checkbox value="commercial-large">{t('survey.project_types.commercial-large')}</Checkbox>
                        <Checkbox value="other">{t('survey.common.other')}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                {data['project_used']?.includes('other') && (
                    <Form.Item
                        name="project_used_other"
                        label={(index - 1) + "a-" + t('survey.common.other_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="automated_testing_experience"
                    label={(index++) + "-" + t('survey.automated_testing_experience')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Select
                        placeholder={t('survey.common.select_option')}
                        options={[
                            {
                                value: "never",
                                label: t('survey.automated_testing_experience_options.never')
                            },
                            {
                                value: "rarely",
                                label: t('survey.automated_testing_experience_options.rarely')
                            },
                            {
                                value: "sometimes",
                                label: t('survey.automated_testing_experience_options.sometimes')
                            },
                            {
                                value: "frequently",
                                label: t('survey.automated_testing_experience_options.frequently')
                            },
                            {
                                value: "always",
                                label: t('survey.automated_testing_experience_options.always')
                            },
                            {
                                value: "other",
                                label: t('survey.common.other')
                            }
                        ]}
                    />
                </Form.Item>

                {data['automated_testing_experience'] === 'other' && (
                    <Form.Item
                        name="automated_testing_experience_other"
                        label={(index - 1) + "a-" + t('survey.common.other_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="cloud_models"
                    label={(index++) + "-" + t('survey.cloud_models')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Checkbox.Group className="flex-column"  onChange={(values) => {
                        const hasNone = values.includes("none");

                        form.setFieldsValue({
                            cloud_models: hasNone ? ["none"] : values
                        });
                    }}>
                        <Checkbox disabled={data['cloud_models']?.includes('none')} value="openai">{t('survey.cloud_model_options.openai')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="gemini">{t('survey.cloud_model_options.gemini')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="claude">{t('survey.cloud_model_options.claude')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="github-copilot">{t('survey.cloud_model_options.github-copilot')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="cursor">{t('survey.cloud_model_options.cursor')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="grok">{t('survey.cloud_model_options.grok')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="mistralai">{t('survey.cloud_model_options.mistralai')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="deepseek">{t('survey.cloud_model_options.deepseek')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="perplexity">{t('survey.cloud_model_options.perplexity')}</Checkbox>
                        <Checkbox value="none">{t('survey.cloud_model_options.none')}</Checkbox>
                        <Checkbox disabled={data['cloud_models']?.includes('none')}  value="other">{t('survey.common.other')}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {data['cloud_models']?.includes('other') && (
                    <Form.Item
                        name="cloud_models_other"
                        label={(index - 1) + "a-" + t('survey.common.other_describe')}
                        rules={[{ required: true, message: t('survey.common.required_describe') }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="local_models"
                    label={(index++) + "-" + t('survey.local_models')}
                    rules={[{ required: true, message: t('survey.common.required_option') }]}
                >
                    <Checkbox.Group
                        className="flex-column"
                        onChange={(values) => {
                            const hasNone = values.includes("none");

                            form.setFieldsValue({
                                local_models: hasNone ? ["none"] : values
                            });
                        }}
                    >
                        <Checkbox
                            value="recommended-light"
                            disabled={data["local_models"]?.includes("none")}
                        >
                            {t("survey.local_model_options.recommended-light")}
                        </Checkbox>

                        <Checkbox
                            value="recommended-heavy"
                            disabled={data["local_models"]?.includes("none")}
                        >
                            {t("survey.local_model_options.recommended-heavy")}
                        </Checkbox>

                        <Checkbox value="none">
                            {t("survey.local_model_options.none")}
                        </Checkbox>

                        <Checkbox
                            value="other"
                            disabled={data["local_models"]?.includes("none")}
                        >
                            {t("survey.common.other")}
                        </Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {data["local_models"]?.includes("other") && (
                    <Form.Item
                        name="local_models_other"
                        label={(index - 1) + "a-" + t("survey.common.other_describe")}
                        rules={[{ required: true, message: t("survey.common.required_describe") }]}
                    >
                        <Input />
                    </Form.Item>
                )}
            </Card>
            <Card type="inner" className="inner-card" title={t("survey.tool_use")} >
                <Form.Item
                    name="easy_to_use"
                    label={(index++) + "-" + t("survey.easy_to_use")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="helped_create_tests"
                    label={(index++) + "-" + t("survey.helped_create_tests")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="tests_required_few_changes"
                    label={(index++) + "-" + t("survey.tests_required_few_changes")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="write_more_tests"
                    label={(index++) + "-" + t("survey.write_more_tests")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="encouraged_pipeline"
                    label={(index++) + "-" + t("survey.encouraged_pipeline")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="saved_time"
                    label={(index++) + "-" + t("survey.saved_time")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="helped_find_bugs"
                    label={(index++) + "-" + t("survey.helped_find_bugs")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                {data["helped_find_bugs"] >= 4 && (
                    <>
                        <Form.Item
                            name="bugs_found_count"
                            label={(index - 1) + "a-" + t("survey.bugs_found_count")}
                            rules={[{ required: true, message: t("survey.common.required_option") }]}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="bugs_found_example"
                            label={(index - 1) + "b-" + t("survey.bugs_found_example")}
                            rules={[{ required: true, message: t("survey.common.required_describe") }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    name="continue_using"
                    label={(index++) + "-" + t("survey.continue_using")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="recommend_tool"
                    label={(index++) + "-" + t("survey.recommend_tool")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Radio.Group className="flex-column">
                        <Radio value={1}>{t("survey.common.likert.1")}</Radio>
                        <Radio value={2}>{t("survey.common.likert.2")}</Radio>
                        <Radio value={3}>{t("survey.common.likert.3")}</Radio>
                        <Radio value={4}>{t("survey.common.likert.4")}</Radio>
                        <Radio value={5}>{t("survey.common.likert.5")}</Radio>
                    </Radio.Group>
                </Form.Item>

            </Card>
            <Card type="inner" className="inner-card" title={t("survey.tool_feedback")} >
                <Form.Item
                    name="software_engineering_areas"
                    label={(index++) + "-" + t("survey.software_engineering_areas")}
                    rules={[{ required: true, message: t("survey.common.required_option") }]}
                >
                    <Checkbox.Group className="flex-column">
                        <Checkbox value="cicd">{t("survey.software_engineering_areas_options.cicd")}</Checkbox>
                        <Checkbox value="uml">{t("survey.software_engineering_areas_options.uml")}</Checkbox>
                        <Checkbox value="code_review">{t("survey.software_engineering_areas_options.code_review")}</Checkbox>
                        <Checkbox value="architecture">{t("survey.software_engineering_areas_options.architecture")}</Checkbox>
                        <Checkbox value="coverage">{t("survey.software_engineering_areas_options.coverage")}</Checkbox>
                        <Checkbox value="documentation">{t("survey.software_engineering_areas_options.documentation")}</Checkbox>
                        <Checkbox value="integration">{t("survey.software_engineering_areas_options.integration")}</Checkbox>
                        <Checkbox value="performance">{t("survey.software_engineering_areas_options.performance")}</Checkbox>
                        <Checkbox value="other">{t("survey.common.other")}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                {data["software_engineering_areas"]?.includes("other") && (
                    <Form.Item
                        name="software_engineering_areas_other"
                        label={(index - 1) + "a-" + t("survey.common.other_describe")}
                        rules={[{ required: true, message: t("survey.common.required_describe") }]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item
                    name="why_useful"
                    required={data["software_engineering_areas"]?.length>0}
                    disabled={data["software_engineering_areas"]?.length===0}
                    label={(index++) + "-" + t("survey.why_useful")}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="greatest_benefit"
                    label={(index++) + "-" + t("survey.greatest_benefit")}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="greatest_problem"
                    label={(index++) + "-" + t("survey.greatest_problem")}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="missing_feature"
                    label={(index++) + "-" + t("survey.missing_feature")}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="what_would_change"
                    label={(index++) + "-" + t("survey.what_would_change")}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Card>

            <Card type="inner" className="inner-card" title={t("survey.final_remarks")}>
            <Form.Item name="consideracoes_finais" label={(index++)+"-"+t('survey.any_comment')}>
                <Input.TextArea rows={5} />
            </Form.Item>

            <Form.Item name="email"
                       label={(index++)+"-"+ t('survey.email_contato')}>
                <Input type="email" />
            </Form.Item>
            </Card>
            <RequiredFieldsSummary
                missingFields={requiredErrors}
            />

            <Form.Item>
                <Button loading={loading} type="primary" block htmlType="submit">{t('survey.enviar')}</Button>
            </Form.Item>

        </Form>
        </Card>
    );
};

export default SurveyForm;
