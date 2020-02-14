/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
    render() {
        const {siteConfig, language = ''} = this.props;
        const {baseUrl, docsUrl} = siteConfig;
        const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
        const langPart = `${language ? `${language}/` : ''}`;
        const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

        const SplashContainer = props => (
            <div className="homeContainer">
                <div className="homeSplashFade">
                    <div className="wrapper homeWrapper">{props.children}</div>
                </div>
            </div>
        );

        const Logo = props => (
            <div className="projectLogo">
                <img src={props.img_src} alt="Project Logo" />
            </div>
        );

        const ProjectTitle = props => (
            <h2 className="projectTitle">
                {props.title}
                <small>{props.tagline}</small>
            </h2>
        );

        const PromoSection = props => (
            <div className="section promoSection">
                <div className="promoRow">
                    <div className="pluginRowBlock">{props.children}</div>
                </div>
            </div>
        );

        const Button = props => (
            <div className="pluginWrapper buttonWrapper">
                <a className="button" href={props.href} target={props.target}>
                    {props.children}
                </a>
            </div>
        );

        return (
            <SplashContainer>
                <div className="inner">
                    <Logo img_src={`${baseUrl}img/logo.svg`} />
                    <ProjectTitle tagline={siteConfig.tagline} />
                    <PromoSection>
                        <Button href={docUrl('doc1.html')}>Get Started</Button>
                    </PromoSection>
                </div>
            </SplashContainer>
        );
    }
}

class Index extends React.Component {
    render() {
        const {config: siteConfig, language = ''} = this.props;
        const {baseUrl} = siteConfig;

        const Block = props => (
            <Container
                padding={['bottom', 'top']}
                id={props.id}
                background={props.background}>
                <GridBlock
                    align="center"
                    contents={props.children}
                    layout={props.layout}
                />
            </Container>
        );

        const TryOut = () => (
            <Block id="try">
                {[
                    {
                        content: 'Loki was created to be able to reuse the layouts of the company\'s systems. It would be a faster way to develop and maintain a standard of components and layout. In this case, the source code was made available on GitHub so that everyone could use it and contribute to improving it.',
                        image: `${baseUrl}img/site-under-construction.png`,
                        imageAlign: 'left',
                        title: 'Why was he created?'
                    }
                ]}
            </Block>
        );

        const Description = () => (
            <Block id="description" background="light">
                {[
                    {
                        content: 'It has components with customization ready and leaving your templates modern and elegant. In addition to having several ready-made filters and wildcard components that every project will use. He already uses Vuetify, in addition to having two types of templates: "Default" and "Gmail".',
                        image: `${baseUrl}img/working-at-desk.png`,
                        imageAlign: 'right',
                        title: 'Why use it?'
                    }
                ]}
            </Block>
        );

        const LearnHow = () => (
            <Block id="learn" background="light">
                {[
                    {
                        content: 'Loki is not a god / giant in Norse mythology. Or god of trickery and mischief. Not a being connected to magic, and who can take different forms. Much less Thor\'s brother. It is a component library using the Vuetify framework, which is maintained by AZ Informática.',
                        image: `${baseUrl}img/creative-design.png`,
                        imageAlign: 'right',
                        title: 'What is Loki?'
                    }
                ]}
            </Block>
        );

        const Showcase = () => {
            if ((siteConfig.users || []).length === 0) {
                return null;
            }

            const showcase = siteConfig.users
                .filter(user => user.pinned)
                .map(user => (
                    <a href={user.infoLink} key={user.infoLink} target="_blank">
                        <img src={user.image} alt={user.caption} title={user.caption} />
                    </a>
                ));

            const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

            return (
                <div className="productShowcaseSection">
                    <h2>Who is Using This?</h2>
                    <p>This project is used by all these users</p>
                    <div className="logos">{showcase}</div>
                    {/*<div className="more-users">*/}
                    {/*  <a className="button" href={pageUrl('users.html')}>*/}
                    {/*    More {siteConfig.title} Users*/}
                    {/*  </a>*/}
                    {/*</div>*/}
                </div>
            );
        };

        return (
            <div>
                <HomeSplash siteConfig={siteConfig} language={language} />
                <div className="mainContainer">
                    <LearnHow />
                    <TryOut />
                    <Description />
                    <Showcase />
                </div>
            </div>
        );
    }
}

module.exports = Index;
