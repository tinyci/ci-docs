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

    const ProjectTitle = () => null;

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
        <Logo img_src={`${baseUrl}img/homepage-main.png`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href="#try">Try It Out</Button>
            <Button href="https://github.com/tinyci/tinyci">Github</Button>
            <Button href="https://test.tinyci.org">
              tinyCI testing tinyCI
            </Button>
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

    const FeatureCallout = () => (
      <div className="showcase-container">
        <div className="productShowcaseSection-1" style={{textAlign: 'center'}}>
          <h2>
            tinyCI aims to have one of the best user experiences out there
          </h2>
          <MarkdownBlock>
            The user experience for other CI systems has not historically been a
            positive experience for our team, so we wish to change that. **We
            will work hard to keep a consistent, easy to use UI.** We have both
            a react-based UI and a CLI component depending on which you'd
            prefer.
          </MarkdownBlock>
          <div style={{fontSize: '0.8em'}}>
            (Clicking on the image will open it in a new window)
          </div>
          <a href="img/screenshots/ui1.png" target="_blank">
            <img width="30%" src="img/screenshots/ui1.png" />
          </a>
          <a href="img/screenshots/ui2.png" target="_blank">
            <img width="30%" src="img/screenshots/ui2.png" />
          </a>
          <a href="img/screenshots/termui.png" target="_blank">
            <img width="30%" src="img/screenshots/termui.png" />
          </a>
        </div>
      </div>
    );

    const TryOut = () => (
      <Block id="try" background="light">
        {[
          {
            content: `Check out our [demos](https://github.com/tinyci/ci-demo)
            and [releases](https://github.com/tinyci/tinyci/releases) for
            more!`,
            image: `${baseUrl}img/try-it-out.png`,
            imageAlign: 'left',
            title: 'Try it Out',
          },
          {},
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block>
        {[
          {
            content: `tinyCI's Github integration is fully compatible with
            [Github Flow](https://guides.github.com/introduction/flow/); OAuth
            support for the entire UI toolchain through it. [Github
            Checks](https://developer.github.com/v3/checks/) support is on the
            way, but for now you can leverage our easy auto-configuration of
            hooks and rich status interface.`,
            title: 'Superior Github Integration',
            image: `${baseUrl}img/installation-guide.png`,
          },
          {
            content:
              'Come to the [configuration guide](/docs/configuration) to learn how configure tinyCI, and to make your first tinyCI compatible repository!',
            image: `${baseUrl}img/learn-how.png`,
            imageAlign: 'left',
            title: 'Configuration Guide',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: `tinyCI provides an easy way to specify, manage and
            execute parallel runs. Using the same specification, leverage your
            diffs to isolate what tests actually need to be tested based on the
            changes you made.`,
            image: `${baseUrl}img/feature-1.png`,
            imageAlign: 'left',
            title:
              'Parallel runs save you time. Diff Selection saves you even *more* time.',
          },
          {
            content: `CI users typically have special needs: Some need to run things
            in an isolated environment, some need to run with additional
            infrastructure, others need compliance management. tinyCI solves
            this problem by making the protocol abstract enough to use by most
            languages and frameworks, allowing you to define what you want in a
            replacement for our runners or even our core services. As long as
            you can speak to the other services, you can do whatever you
            want.`,
            image: `${baseUrl}img/feature-2.png`,
            imageAlign: 'left',
            title: 'Almost nobody needs a plain CI.',
          },
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
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
