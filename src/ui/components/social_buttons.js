import {
    FacebookShareButton,
    LineShareButton,
    LinkedinShareButton,
    PocketShareButton,
    RedditShareButton,
    TelegramShareButton,
    TumblrShareButton,
    TwitterShareButton,
    EmailShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    TelegramIcon,
    WhatsappIcon,
    RedditIcon,
    TumblrIcon,
    EmailIcon,
    LineIcon,
    PocketIcon,
} from "react-share";

export default function SocialButtons({title, url}) {
    return <div>
        <FacebookShareButton
            url={url}
            title={title}
        >
            <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
            url={url}
            title={title}
        >
            <TwitterIcon size={32} round />
        </TwitterShareButton>
        <RedditShareButton
            url={url}
            title={title}
            windowWidth={660}
            windowHeight={460}
        >
            <RedditIcon size={32} round />
        </RedditShareButton>
        <LinkedinShareButton url={url}>
            <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <TumblrShareButton
            url={url}
            title={title}
        >
            <TumblrIcon size={32} round />
        </TumblrShareButton>
        <TelegramShareButton
            url={url}
            title={title}
        >
            <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton
            url={url}
            title={title}
            separator=":: "
        >
            <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <LineShareButton
            url={url}
            title={title}
        >
            <LineIcon size={32} round />
        </LineShareButton>
        <PocketShareButton
            url={url}
            title={title}
        >
            <PocketIcon size={32} round />
        </PocketShareButton>
        <EmailShareButton
            url={url}
            title={title}
            body={title}
        >
            <EmailIcon size={32} round />
        </EmailShareButton>
    </div>
}
