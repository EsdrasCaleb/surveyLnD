import { useState, useEffect } from "react";
import {
    Typography,
    Tooltip,
    Button,
    Checkbox,
    Space
} from "antd";
import {
    QuestionCircleOutlined,
    DownloadOutlined,
    ArrowRightOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";

export default function Acceptance({
                                       onAccept,
                                       onDecline,
                                       previusaccept = false,
                                   }) {
    const { t } = useTranslation();
    const contentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef
    });

    const paragraphs = t("consent.paragraphs", {
        returnObjects: true,
    });

    const [accepted, setAccepted] = useState(previusaccept);

    useEffect(() => {
        setAccepted(previusaccept);
    }, [previusaccept]);

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
            <div ref={contentRef}>
            <Typography.Title>
                {t("consent.title")}
                <Tooltip title={t("consent.helper")}>
                    <QuestionCircleOutlined
                        style={{
                            color: "red",
                            fontSize: 24,
                            verticalAlign: "text-top",
                            marginLeft: 8,
                        }}
                    />
                </Tooltip>
            </Typography.Title>

            {paragraphs.map((p, idx) => (
                <Typography.Paragraph
                    key={idx}
                    style={{ marginBottom: 16 }}
                >
                    <span
                        dangerouslySetInnerHTML={{
                            __html: p,
                        }}
                    />
                </Typography.Paragraph>
            ))}
            </div>
            <div
                style={{
                    marginTop: 24,
                    marginBottom: 24,
                }}
            >
                <Checkbox
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                >
                    {t("consent.agree")}
                </Checkbox>
            </div>

            <Space
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    icon={<DownloadOutlined />}
                    onClick={handlePrint}
                >
                    {t("download_rsc")}
                </Button>

                <Space>
                    <Button danger onClick={onDecline}>
                        {t("consent.decline")}
                    </Button>

                    <Button
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        disabled={!accepted}
                        onClick={onAccept}
                    >
                        {t("continue")}
                    </Button>
                </Space>
            </Space>
        </div>
    );
}