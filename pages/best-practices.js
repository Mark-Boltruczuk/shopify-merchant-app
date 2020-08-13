import {
  Card,
  Layout,
  Stack,
  Page,
  Heading,
  Button,
  TextStyle,
  Badge,
  Icon,
  DisplayText,
  TextContainer,
  Collapsible,
  Link,
} from "@shopify/polaris";
import { ChevronRightMinor } from "@shopify/polaris-icons";

import ReachOutSvg from "../components/ReachOutSvg";
import BestTip from "../components/BestTip";
const tips = [
  {
    title: `📸 Invest in good photography and copy.`,
    description: `With e-commerce, customers miss out on the opportunity to touch, feel, try on, and examine your merchandise. Your job is to get them as close as possible with great photography (from a variety of angles and showcasing the product in a variety of states) and compelling copy. This might mean investing in some higher-quality photography equipment and hiring marketing copywriters to write your product descriptions. Make sure that your unique brand voice shines through! If you’re not manufacturing your own goods, avoid merely copy/pasting the supplier’s product descriptions. Other resellers will be doing exactly the same thing, which means you won’t stand out from your competitors.`,
  },
  {
    title: `⏩ Optimize your site images for speed.`,
    description: `A fast website can convert to a fast sale, and images are some of the "heaviest" components to a site. Before you upload a new image to your store, remember to compress them with a tool like Squoosh.app or Crush.Pics. In a perfect world, your images should be smaller than 100KB.`,
  },
  {
    title: `📝 Don't forget your metadata.`,
    description: `Shopify makes this easy. Simply scroll to the bottom of any product, collection, page, or blog post, click [Edit website SEO] where it says 'Search engine listing preview,' and enter a descriptive, keyword-rich page title and description. These are what potential customers see when they search for your products in Google, so make them look as appealing as possible.`,
  },
  {
    title: `🌟 Be able to define your unique value proposition.`,
    description: `This means a clear, concise statement that explains the problem you solve, the solution you provide, and why you’re unique. Why should your customers choose you, instead of a competitor? This one’s critical. If you can’t define your own UVP in strong, simple language, how can you expect customers to remember your uniqueness?`,
  },
  {
    title: `👀 Know your competitors.`,
    description: `Don't copy your competitors; let’s get that straight. But as part of developing your unique value proposition, you should have reviewed your competitors to understand why you’re different from them. What are they doing better than you? Can you match them at that level? What are they doing wrong; can you capitalize on that?`,
  },
  {
    title: `🎁 Reward your customers.`,
    description: `Having an amazing user experience is a bit part of growing customer loyalty. With the Merchant Milestones app you already have the ability to send emails to customers that help you reach your milestones, and surprise them with a discount, free goodie, or something else wonderful! Consider implementing a loyalty and referral program for your store as well, to further encourage customers to come back themselves AND spread the word to others.`,
  },
  {
    title: `⏰ Allocate time each day to working on your store.`,
    description: `We don’t mean tweaking the website, but rather: providing fast and personalized customer service, developing new Facebook ads, engaging with customers on social media, and so on. Treat your store like a living, growing thing. It needs nurturing each day! If your e-commerce venture is not your full-time job, you’ll need to make an effort to carve out time for it each day.`,
  },
  {
    title: `🎯 Understand your target audience.`,
    description: `As part of your unique value proposition, you should also understand your target audience--the group of people who have the problem you’re trying to solve. What do they actually want? Not only do you have to ensure that the solution you’re providing is one they want in the first place, but you’ll also know where to find them and what “language” to speak to them.`,
  },
  {
    title: `📈 Stay up to date on trends.`,
    description: `Make sure you're keeping abreast of news, trends, and changes in your niche industry AND e-commerce at large. This includes practicing "social listening" by monitoring what your target audience is talking about on social media. Keep an ear out for what they're talking about, and you'll know how best to pivot, if necessary.`,
  },
  {
    title: `📣 If you want to be truly successful, you have to do consistent marketing and advertising.`,
    description: `A great website won’t do you any good if no one knows about it. Make sure you have a solid inbound marketing plan that uses a variety of customer touchpoints to reach your target audience where they are. This includes email marketing, SEO, content marketing, and a strong social media strategy.`,
  },
];

class GoodHabits extends React.Component {
  state = {
    hidden: false,
  };

  handleHideClick = () => {
    this.setState({ hidden: !this.state.hidden });
  };

  render() {
    const { hidden } = this.state;

    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Stack distribution="equalSpacing">
              <Stack.Item>
                <DisplayText size="medium">
                  Did you try these tips & tricks?
                </DisplayText>
              </Stack.Item>
              <Stack.Item>
                <Button primary={hidden} onClick={this.handleHideClick}>
                  {this.state.hidden ? "Show" : "Hide"} Tips & Tricks
                </Button>
              </Stack.Item>
            </Stack>
          </Layout.Section>
          {!hidden && (
            <Layout.Section>
              <Card>
                {tips.map((tip) => (
                  <BestTip title={tip.title} description={tip.description} />
                ))}
              </Card>
            </Layout.Section>
          )}
          <Layout.Section>
            <Card title="Top Articles">
              <Card.Section>
                <Stack>
                  <Stack.Item>
                    <img
                      src="https://blog.takoagency.com/hubfs/man-person-legs-grass-539_1280x.jpg"
                      className="rounded-img"
                      alt=""
                    />
                  </Stack.Item>
                  <Stack.Item fill>
                    <Stack vertical>
                      <Stack.Item>
                        <div className="banner-author">
                          <img
                            src="https://app.hubspot.com/settings/avatar/ed1a2cb4a139a9d2833f81e3f087e845"
                            alt="Picture of Grace Everitt"
                          />
                          <span className="Polaris-Heading">Grace Everitt</span>
                        </div>
                      </Stack.Item>
                      <Stack.Item>
                        <Heading>
                          <Link
                            url="https://blog.takoagency.com/tako-stand/shopify-ab-testing"
                            external
                          >
                            Using A/B Testing to Improve Your Shopify Store
                          </Link>
                        </Heading>
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <div className="align-bottom">
                      <TextStyle variation="subdued">
                        Published Nov 8, 2019
                      </TextStyle>
                    </div>
                  </Stack.Item>
                </Stack>
              </Card.Section>
              <Card.Section>
                <Stack>
                  <Stack.Item>
                    <img
                      src="https://blog.takoagency.com/hubfs/blogging-blur-business-communication-261662_1280x.jpg"
                      className="rounded-img"
                      alt=""
                    />
                  </Stack.Item>
                  <Stack.Item fill>
                    <Stack vertical>
                      <Stack.Item>
                        <div className="banner-author">
                          <img
                            src="https://app.hubspot.com/settings/avatar/ed1a2cb4a139a9d2833f81e3f087e845"
                            alt="Picture of Grace Everitt"
                          />
                          <span className="Polaris-Heading">Grace Everitt</span>
                        </div>
                      </Stack.Item>
                      <Stack.Item>
                        <Heading>
                          <Link
                            url="https://blog.takoagency.com/tako-stand/ecommerce-blogging"
                            external
                          >
                            Does an e-Commerce Store Need a Blog?
                          </Link>
                        </Heading>
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <div className="align-bottom">
                      <span className="Polaris-TextStyle--variationSubdued">
                        Published Jan 8, 2020
                      </span>
                    </div>
                  </Stack.Item>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <Card.Section>
                <Stack spacing="loose" vertical>
                  <Stack.Item>
                    <Stack distribution="center">
                      <ReachOutSvg />
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <div className="Polaris-Stack Polaris-Stack--distributionCenter text-wrapper">
                      <h3 className="Polaris-Heading py-16">
                        Need help from experts?
                      </h3>
                      <div className="Polaris-TextStyle--variationSubdued text-center full-width">
                        Reach out to us here for a FREE 30 min consultation.
                      </div>
                    </div>
                  </Stack.Item>
                  <Stack.Item>
                    <Stack distribution="center">
                      <Button
                        primary
                        onClick={() =>
                          window.open(
                            "https://takoagency.com/pages/contact-us",
                            "_blank"
                          )
                        }
                      >
                        Reach Out Now
                      </Button>
                    </Stack>
                  </Stack.Item>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default GoodHabits;
