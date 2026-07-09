import {Typography, Button, Divider, Space, Tooltip} from 'antd';
import { useTranslation } from 'react-i18next';
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {DownloadOutlined, QuestionCircleOutlined} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ConcludedScreen({ uid, onChangeAnswers }) {
    const { t } = useTranslation();
    const contentRef = useRef();

    const reactToPrint = useReactToPrint({
        contentRef: contentRef,
    });
    const paragraphs = t("consent.paragraphs", {
        returnObjects: true,
    });


    return (
<>
    <Title>{t('thankyou.title')}</Title>
    <Paragraph>{t('thankyou.text')}</Paragraph>
        {uid?<Paragraph>{t('thankyou.removal', { uid })}</Paragraph>:''}

    <Space direction="vertical" style={{ width: '100%' }}>
        <Button block onClick={onChangeAnswers}>
            {t('thankyou.change')}
        </Button>
        <Button
            icon={<DownloadOutlined />}
            onClick={reactToPrint}
        >
            {t("download_rsc")}
        </Button>
    </Space>
    <div style={{ display: "none" }}>
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
            <Divider />
            <Typography.Paragraph>
                {t("thankyou.removal", { uid })}
            </Typography.Paragraph>
        </div>
    </div>
</>
);
}