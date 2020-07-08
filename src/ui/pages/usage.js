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
                <h2 className={utilStyles.headingLg}>User Agreement</h2>

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

                <div className={utilStyles.nested_ol}>
                    <ol>
                        <li>
                            This User Agreement governs your relationship with pac.foundation and your use of and access
                            to all services and products provided by pac.foundation (collectively, PAC Products). You
                            agree that by accessing or using any part of PAC Products you are bound by the terms of this
                            User Agreement (the Terms), including the applicable Privacy Policy and Community Guidelines
                            incorporated herein.
                        </li>
                        <li>
                            You may not use PAC Products unless all of the following apply to you, and you affirm that
                            all of the following apply to you:
                            <ol>
                                <li>You are at least 13 years old;</li>
                                <li>
                                    You are either an adult over the age of 18 years old, an emancipated minor, or you
                                    have express permission from your parent or legal guardian to use PAC Products;
                                </li>
                                <li>
                                    You are legally allowed to use PAC Products where you live;
                                </li>
                                <li>
                                    You are not using PAC Products or accepting the Terms on behalf of any other entity,
                                    such as a company or organization, unless you have authority to bind that entity to
                                    these Terms;
                                </li>
                                <li>
                                    You have not been banned by pac.foundation from using PAC Products.
                                </li>
                            </ol>
                        </li>
                        <li>
                            The pac.foundation <a href="/privacy">Privacy Policy</a> describes what pac.foundation can do with
                            information about you received by pac.foundation when you use PAC Products. You agree to the
                            terms of the Privacy Policy, including the transfer of information to other countries for
                            storage, processing, and use.
                        </li>
                        <li>
                            Any content that you post to PAC Products must satisfy all of the following criteria, and
                            you affirm that any content posted, submitted, or otherwise provided by you to PAC Products
                            satisfies this criteria:
                            <ol>
                                <li>
                                    You have the legal right to post the content to PAC Products.
                                </li>
                                <li>
                                    The content and the purpose for posting it complies with all laws, rules, and
                                    regulations that may apply.
                                </li>
                                <li>
                                    The content does not infringe the intellectual property rights (such as copyrights
                                    and trademark rights) of any other person or entity.
                                </li>
                                <li>
                                    The content does not include non-public personal private information belonging to
                                    someone else, such as another person’s birthdate, home address, or telephone number.
                                </li>
                                <li>
                                    The content complies with the pac.foundation Community Guidelines. You are
                                    responsible for your use of PAC Products and for any content that you post.
                                    pac.foundation does not endorse, support, represent, or affirm the completeness,
                                    truthfulness, accuracy, or reliability of any of the content posted through PAC
                                    Products, nor does pac.foundation endorse any opinions expressed through PAC
                                    Products. All content is the sole responsibility of the person who originated the
                                    content, and pac.foundation does not take responsibility for such content.
                                </li>
                            </ol>
                        </li>
                        <li>
                            You grant to pac.foundation a license to any content posted by you to PAC Products,
                            including a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to
                            use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute your
                            content. You agree that pac.foundation or its service providers or partners may display
                            advertising in connection with your content and otherwise monetize your content without
                            compensation to you. You warrant that you have all rights necessary to grant these rights to
                            pac.foundation and pac.foundation users. You also grant a limited non-exclusive,
                            royalty-free license to any user of PAC Products to use, copy, reproduce, process, adapt,
                            modify, publish, transmit, display, and distribute any content posted by you to PAC Products
                            solely in connection with that users use of PAC Products. The licenses granted by you
                            hereunder do not include any moral rights or right of attribution.
                        </li>
                        <li>
                            You may not interfere with PAC Products in any way, such as by accessing PAC Products
                            through automated means in a manner that puts excessive demand on PAC Products; by hacking
                            PAC Products; by accessing without authorization areas of PAC Products that are protected by
                            technical measures designed to prevent unauthorized access; by testing the vulnerability of
                            PAC Products; by impersonating pac.foundation or PAC Products; by accessing PAC Products for
                            any purpose that competes with the interests of pac.foundation; by spamming the users of PAC
                            Products; by failing to respond to operational communications or requests from
                            pac.foundation; or through any other type of interference with PAC Products or
                            pac.foundation’s relationships with others.
                        </li>
                        <li>
                            pac.foundation may remove any content and terminate your access to PAC Products at any time
                            and for any reason to the extent pac.foundation reasonably believes (a) you have violated
                            these Terms or pac.foundation’s Community Guidelines, (b) you create risk or possible legal
                            exposure for pac.foundation, or (c) you are otherwise engaging in unlawful conduct—although
                            pac.foundation endeavors to allow all free speech that is lawful and does not infringe the
                            legal rights of others. Any invitation made by pac.foundation to you to use PAC Products or
                            submit content to PAC Products, or the fact that pac.foundation may receive a benefit from
                            your use of PAC Products or provision of content to PAC Products, will not obligate
                            pac.foundation to maintain any content or maintain your access to PAC Products.
                            pac.foundation will have no liability to you for removing any content, for terminating your
                            access to PAC Products, or for modifying or terminating PAC Products.
                        </li>
                        <li>
                            PAC Products are provided to you as-is and at your own risk. PAC Products come with no
                            express or implied warranties, except those that cannot be disclaimed under the law. 4
                            pac.foundation DISCLAIMS ALL EXPRESS OR IMPLIED WARRANTIES AND CONDITIONS, SUCH AS
                            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. pac.foundation
                            makes no representation or endorsement about the function of PAC Products or any content
                            available through PAC Products. pac.foundation has no responsibility or liability to you
                            arising from your use of PAC Products. pac.foundation has no responsibility or liability to
                            you arising from content provided by you or any other person, even if such content is
                            untrue, harmful, damaging, offensive, inappropriate, fraudulent, tortious, unlawful,
                            contrary to social norms, etc. Although pac.foundation may make efforts to review or monitor
                            content, you agree that you will not rely on this fact for any purpose. pac.foundation has
                            no responsibility or liability to you arising from hacking event, data breach, theft, misuse
                            of information, conspiracy, racket, fraud, act of terrorism, misappropriation of
                            information, technical malfunction, interruption of service, or similar event that may cause
                            you to suffer damage, loss, or injury, including without limitation any damage to or loss of
                            your personal property, data, operations, information, reputation, goodwill, profits, etc.
                            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AND REGARDLESS OF THE NATURE OF THE CAUSE
                            OF ACTION, pac.foundation WILL NOT BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL,
                            CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOST PROFITS, WHETHER INCURRED
                            DIRECTLY OR INDIRECTLY, OR FOR INTANGIBLE LOSSES, ARISING FROM (a) YOUR ACCESS TO OR USE OF
                            (OR INABILITY TO ACCESS OR USE) PAC Products; (b) FROM THE ACTS OR OMISSIONS OF ANY OTHER
                            PERSON OR THIRD PARTY, INCLUDING, WITHOUT LIMITATION, ANY DEFAMATORY, OFFENSIVE, OR ILLEGAL
                            CONDUCT OF OTHER PERSONS OR THIRD PARTIES; (c) ANY CONTENT OBTAINED FROM PAC Products; OR
                            (d) UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR CONTENT OR COMMUNICATIONS THROUGH PAC
                            Products. IN NO EVENT SHALL THE AGGREGATE LIABILITY OF pac.foundation ARISING OUT OF OR
                            RELATING TO THESE TERMS OR PAC Products EXCEED THE GREATER OF TWO HUNDRED U.S. DOLLARS (U.S.
                            $200.00) OR THE AMOUNT YOU PAID pac.foundation, IF ANY, IN THE PAST SIX MONTHS FOR PAC
                            Products GIVING RISE TO THE CLAIM. THE LIMITATIONS OF THIS SECTION SHALL APPLY TO ANY THEORY
                            OF LIABILITY, WHETHER BASED ON WARRANTY, CONTRACT, STATUTE, TORT (INCLUDING NEGLIGENCE), OR
                            OTHERWISE, AND SHALL FURTHER APPLY WHETHER OR NOT pac.foundation HAS BEEN INFORMED OF THE
                            POSSIBLITY OF ANY SUCH DAMAGES AND EVEN IF A REMEDY LAID OUT IN THESE TERMS IS FOUND TO HAVE
                            FAILED ITS ESSENTIAL PURPOSE. 5
                        </li>
                        <li>
                            Applicable law and jurisdiction. The laws of Singapore, excluding its choice of law
                            provisions, will govern these Terms and any dispute that arises between you and
                            pac.foundation. All disputes related to these Terms or PAC Products will be brought solely
                            in the state or federal courts located in Singapore, and you consent to personal
                            jurisdiction and waive any objection as to inconvenient forum.
                        </li>
                        <li>
                            You affirm that you are competent to agree to be bound by this User Agreement, meaning that
                            you are over the age of 18, an emancipated minor, or have legal parental or guardian
                            consent.
                        </li>
                        <li>
                            pac.foundation cannot waive any right to enforce this User Agreement, unless it does so
                            expressly in writing. No waiver of any part of this User Agreement, will be a further or
                            continuing waiver of that part or any other part, and no failure to enforce any part of his
                            User Agreement will be deemed a waiver of any kind.
                        </li>
                        <li>
                            pac.foundation may modify the Terms of this User Agreement in any way and at any time
                            without notice to you, and you agree to be responsible for making yourself aware of any
                            modification of the Terms and to be bound by any modification of the Terms when you continue
                            to access or use PAC Products after any such modification. As a matter of courtesy,
                            pac.foundation endeavors to inform its users of any such changes. These Terms supersede all
                            prior agreements between you and pac.foundation pertaining to PAC Products. Except for the
                            statements in this document and the documents expressly incorporated herein by reference, no
                            statement by pac.foundation or anyone associated with pac.foundation, whether verbal or
                            written, can modify or supplement the Terms of this User Agreement unless the modification
                            or supplement is stated expressly in writing by referring to this User Agreement. If any of
                            the Terms in the User Agreement are held to be invalid or unenforceable by a court or
                            arbitrator or by operation of law, the remaining Terms will remain in effect.
                        </li>
                    </ol>
                </div>

                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            </section>
        </Layout>
    )
}
