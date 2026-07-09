import {
    Typography,
    Button,
    Divider
} from "antd";

import { DownloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "./LanguageSwitcher";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";

export default function RSCPluginPage() {
    const { t, i18n } = useTranslation();
    const contentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef
    });

    const paragraphs = t("rsc-plugin", {
        returnObjects: true
    });

    return (
        <div
            style={{
                maxWidth: 900,
                margin: "0 auto",
                padding: 24
            }}
        >
            <div ref={contentRef}>
            <Typography.Title>
                {t("consent.title")}
            </Typography.Title>

            {paragraphs.map((p, idx) => (
                <Typography.Paragraph key={idx}>
                    <span
                        dangerouslySetInnerHTML={{
                            __html: p
                        }}
                    />
                </Typography.Paragraph>
            ))}
            </div>
            <Divider />

            <Button
                type="primary"
                size="large"
                onClick={handlePrint}
                icon={<DownloadOutlined />}
            >
                {t("download_rsc")}
            </Button>

        </div>
    );
}