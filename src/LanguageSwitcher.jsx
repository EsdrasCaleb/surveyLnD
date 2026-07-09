import React, {useEffect} from "react";
import { Select, Checkbox, Flex, Typography, Alert } from "antd";
import {useTranslation} from "react-i18next";

const { Option } = Select;

const LanguageSwitcher = ({ i18n, data, setData, showShareBrowser = true }) => {
    const { t } = useTranslation();
    const stable = ["en", "es","pt-BR"];

    const candidates = i18n.languages || [];

    const safeLang =
        candidates.find(l => stable.includes(l)) ||
        "en";

    useEffect(() => {
        setData({
            ...data,
            "form_language": stable.includes(safeLang)?safeLang:safeLang+' translated',
        });
    }, []);

    const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
        setData({
            ...data,
            "form_language": stable.includes(value)?value:value+' translated',
        });
    };

    const handleCheckboxChange = (field) => (e) => {
        setData({
            ...data,
            [field]: e.target.checked,
        });
    };

    return (
        <>
            <Alert
                type="warning"
                showIcon
                message={t("temp_message")}
                style={{
                    marginBottom: 12,
                    maxWidth: 900,
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
            />
            <Flex className="flex" gap="middle" justify="center" orientation="horizontal">
                <Typography.Text strong={5} > {t("studyname")}</Typography.Text>
                <Select
                    defaultValue={safeLang}
                    style={{ width: 120 }}
                    onChange={handleLanguageChange}
                >
                    <Option value="en">English</Option>
                    <Option value="pt-BR">Português</Option>
                    <Option value="es">Español</Option>
                </Select>
                {showShareBrowser && (
                    <Checkbox
                        checked={data?.shareBrowser || false}
                        onChange={handleCheckboxChange("shareBrowser")}
                    >
                        {t("switcher.share_browser_language")}
                    </Checkbox>
                )}
            </Flex>
        </>
    );
};

export default LanguageSwitcher;
