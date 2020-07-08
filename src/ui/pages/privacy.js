import Layout, {siteTitle} from "../components/layout";
import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import styles from "../components/layout.module.css";
import Link from "next/link";

export default function Home() {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}: About</title>
                <script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"/>
                <script type="text/javascript" src="/assets/js/search.js"/>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
                <h2 className={utilStyles.headingLg}>Privacy Policy</h2>

                <h4>Pac.foundation</h4>
                <h5>07/07//2020</h5>

                <p>
                    pac.foundation, provides it’s platform and information as a public service under section 230
                    Of the Communications Decency Act (CDA) stating "No provider or user of an interactive computer
                    service shall be treated as the publisher or speaker of any information provided by another
                    information content provider" (47 U.S.C. § 230).
                </p>

                <p>
                    The protected intermediaries includes interactive computer service providers that publish
                    third-party content which is pac.foundations & it’s platform’s core mode. CDA 230 creates a broad
                    protection that has allowed innovation and free speech online to flourish.
                </p>

                <p>
                    pac.foundation and its affiliates (“Company,” “we,” “our,” and/or “us”) value the privacy of
                    individuals who use our social news application, website, and related services (collectively, our
                    “Services”). This privacy policy (the “Privacy Policy”) explains how we may collect, use, and share
                    information from users of our Services (“Users,” “you,” and/or “your”) to facilitate your
                    commenting, social news, and influencer networking experience. By using our Services, you agree to
                    the collection, use, disclosure, and procedures this Privacy Policy describes. Beyond the Privacy
                    Policy, your use of our Services is also subject to our <a href="/usage">User Agreement</a>
                </p>
                <p>
                    We do not sell your information to third parties or share your information with foreign governments
                    except in the limited circumstances described in this Privacy Policy (see “How We Share the
                    Information We Collect” below for more detail).
                </p>

                <h4>Information We Collect</h4>

                <p>
                    We may collect a variety of information from or about you or your devices from various sources, as
                    described below.
                </p>

                <h5>A. Information You Provide to Us.</h5>

                <p>
                    User Content. We collect any information you choose to provide on our Services, such as posts,
                    photos, videos, gifs, comments, votes, and echoes.
                </p>
                <p>
                    Communications. If you contact us directly, we may receive additional information about you. For
                    example, if you contact us for customer support, we may receive your name, email address, phone
                    number, the contents of any message or attachments you may send to us, and any other information you
                    choose to provide.
                </p>

                <h5>B. Information We Collect When You Use Our Services.</h5>

                <p>
                    Location Information. When you use our Services, we may infer your general location information, for
                    example by using your internet protocol (IP) address.
                </p>
                <p>
                    Device Information. We may receive information about the device and software you use to access our
                    Services, including IP address, device type, web browser type, operating system version, phone
                    carrier and manufacturer, user agents, application installations, device identifiers, mobile
                    advertising identifiers, and push notification tokens.
                </p>
                <p>
                    Usage Information. To help us understand how you use our Services and to help us improve them, we
                    automatically receive information about your interactions with our Services, such as the posts or
                    other content you view, the searches you conduct, the people you follow, and the dates and times of
                    your visits.
                </p>

                <p>
                    Information from Cookies and Similar Technologies. We and our third party partners, such as
                    analytics partners, collect information using cookies, pixel tags, and similar technologies. Cookies
                    are small text files containing a string of alphanumeric characters. We may use both session cookies
                    and persistent cookies. A session cookie disappears after you close your browser. A persistent
                    cookie remains after you close your browser and may be used by your browser on subsequent visits to
                    our Services.
                </p>
                Please review your web browser’s “Help” file to learn the proper way to modify your cookie settings.
                Please note that if you delete or choose not to accept cookies from our Services, you may not be able to
                utilize the features of our Services to their fullest potential.


                <h5>How We Use the Information</h5>

                <p>
                    We Collect We may use the information we collect:
                </p>
                <ul>
                    <li>To provide, maintain, and improve our Services;</li>
                    <li>To personalize your experience on our Services, such as by providing tailored content and
                        recommendations;
                    </li>
                    <li>To understand and analyze how you use our Services and develop new products, services, features,
                        and/or functionality;
                    </li>
                    <li>To communicate with you, provide you with updates and other information relating to our
                        Services,
                        provide information that you request, respond to comments and questions, and otherwise provide
                        customer support;
                    </li>
                    <li>For marketing and advertising purposes, such as developing and providing promotional and
                        advertising
                        materials that may be relevant, valuable or otherwise of interest to you;
                    </li>
                    <li>To send you text messages and push notifications;</li>
                    <li>To verify your identity and determine your eligibility to join our influencer network;</li>
                    <li>To find and prevent fraud and respond to trust and safety issues;</li>
                    <li>For compliance purposes, including enforcing our User Agreement or other legal rights, or as may
                        be
                        required by applicable laws and regulations or requested by any judicial process or governmental
                        agency; and
                    </li>
                    <li>For other purposes for which we provide specific notice at the time the information is
                        collected.
                    </li>
                </ul>

                <h5>How We Share the Information We Collect</h5>

                <p>
                    Vendors and Service Providers. We may share any information we receive with vendors and service
                    providers retained in connection with the provision of our Services.
                </p>
                <p>
                    Marketing. We do not rent, sell, or share information about you with nonaffiliated third parties for
                    their direct marketing purposes unless we have your affirmative express consent.
                </p>
                <p>
                    Analytics Partners. We use may use 3rd party analytics services to collect and process certain
                    application analytics data.
                </p>
                <p>
                    As Required By Law and Similar Disclosures. We may access, preserve, and disclose your information
                    if we believe doing so is required or appropriate to: (a) comply with law enforcement requests and
                    legal process, such as a court order or subpoena; (b) respond to your requests; or (c) protect your,
                    our, or others’ rights, property, or safety. For the avoidance of doubt, the disclosure of your
                    information may occur if you post any objectionable content on or through our Services.
                </p>

                <p>
                    Merger, Sale, or Other Asset Transfers. We may transfer your information to service providers,
                    advisors, potential transactional partners, or other third parties in connection with the
                    consideration, negotiation, or completion of a corporate transaction in which we are acquired by or
                    merged with another company or we sell, liquidate, or transfer all or a portion of our assets.
                </p>
                <p>
                    The use of your information following any of these events will be governed by the provisions of this
                    Privacy Policy in effect at the time the applicable information was collected. Consent. We may also
                    disclose your information with your permission.
                </p>
                <p>
                    Third Parties Our Services may contain links to other websites, products, or services that we do not
                    own or operate. We are not responsible for the privacy practices of these third parties. Please be
                    aware that this Privacy Policy does not apply to your activities on these third party services or
                    any information you disclose to these third parties. We encourage you to read their privacy policies
                    before providing any information to them.
                </p>
                <p>
                    Security We make reasonable efforts to protect your information by using physical and electronic
                    safeguards designed to improve the security of the information we maintain. However, as our Services
                    are hosted electronically, we can make no guarantees as to the security or privacy of your
                    information.
                </p>
                <p>
                    Children We do not knowingly collect, maintain, or use personal information from children under 13
                    years of age, and no part of our Services is directed to children. If you learn that a child has
                    provided us with personal information in violation of this Privacy Policy, then you may alert us at
                    pac@unification.com
                </p>
                <p>
                    International Transfers of Data If you choose to use our Services from the European Union or other
                    regions of the world with laws governing data collection and use that may differ from then please
                    note that you are transferring your personal information outside of those regions for storage and
                    processing.
                </p>

                <p>
                    By providing any information, including personal information, on or to our Services, you consent to
                    such transfer, storage, and processing.
                </p>

                <p>
                    Update Your Information or Pose a Question You can update your account and profile information
                    through your account settings.
                </p>

                <p>
                    If you have questions about your privacy on the Services or this privacy policy, please contact us
                    at pac@unification.com
                </p>
                <p>
                    Changes to the Privacy Policy We will post any adjustments to the Privacy Policy on this page, and
                    the revised version will be effective when it is posted.
                </p>
                <p>
                    If we materially change the ways in which we use or share personal information previously collected
                    from you through our Services, we will notify you through our Services, by email, or other
                    communication.
                </p>
                <p>
                    If you have any questions, comments, or concerns about our processing activities, please email us at
                    pac@unification.com
                </p>
                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            </section>
        </Layout>
    )
}
