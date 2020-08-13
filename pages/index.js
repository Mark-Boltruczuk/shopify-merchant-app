import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Stack, Layout, Page, Card, Tabs, Button } from "@shopify/polaris";
import { Redirect } from "@shopify/app-bridge/actions";
import { Context } from "@shopify/app-bridge-react";
import axios from "axios";

import PossibleMilestone from "../components/PossibleMilestone";
import ReachedMilestone from "../components/ReachedMilestone";
import ActiveMilestone from "../components/ActiveMilestone";

import SetGoalSvg from "../components/SetGoalSvg";
import TrackGoalSvg from "../components/TrackGoalSvg";
import GoodHabitSvg from "../components/GoodHabitSvg";
import ChoosePlanSvg from "../components/ChoosePlanSvg";

import {
  ACTIVE,
  REACHED,
  DAY,
  WEEK,
  MONTH,
  SPECIFIC,
  PERIODIC,
  NOPERIOD,
  RANGE,
  PRODUCT,
  SALES,
  TRAFFIC,
  TYPES,
  DATETYPES,
  PERIODTYPES,
  BRONZE,
  SILVER,
  GOLD,
  PLUS,
  CANCELED,
  EXPIRED,
} from "../helpers/Constants";

class Index extends React.Component {
  static contextType = Context;

  state = {
    milestones: this.props.milestones,
    isReady: this.props.merchant.is_ready,
    loading: false,
    selected: 0,
  };

  format = (data) => {
    return {
      type: data.type,
      amount: data.amount,
      product: data.product,
      period: data.period,
      period_by_type: data.periodByType,
      date_type: data.dateType,
      emailable: data.emailable,
      status: data.status,
      parent_id: -1,
      merchant_id: this.props.merchant.id,
      started_at: data.startedAt,
      expired_at: data.expiredAt,
    };
  };

  save = async (milestone) => {
    console.log("-----------------");
    console.log(milestone);
    console.log("-----------------");

    const milestones = this.state.milestones;
    const res = await axios.post("/api/milestone", this.format(milestone));

    if (res.status === 200)
      this.setState({ milestones: [...milestones, res.data] });
  };

  handleTabChange = (selectedTabIndex) => {
    this.setState({ selected: selectedTabIndex });
  };

  goToSubscriptions = () => {
    const app = this.context;
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.APP, "/subscription");
  };

  handleReadyClick = async () => {
    this.setState({ loading: true });
    const res = await axios.post("/api/isReady");
    if (res.status === 200) this.setState({ isReady: true });
    this.setState({ loading: false });
  };

  renderTabContent = (milestones, plan, type) => {
    const self = this;
    const emailable = type != TRAFFIC;
    const app = this.context;

    const redirectToBestPractices = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, "/best-practices");
    };

    let activeMilestones = milestones.filter(
      (m) => m.status === ACTIVE && m.type === type
    );
    let reachedMilestones = milestones.filter(
      (m) => m.status === REACHED && m.type === type
    );
    let usedMilestones = milestones.filter(
      (m) => m.parent_id === -1 && m.status !== CANCELED
    );

    let possibleMilestones = 0;
    if (plan === BRONZE) {
      possibleMilestones = 3 - usedMilestones.length;
    } else if (plan === SILVER) {
      possibleMilestones = 5 - usedMilestones.length;
    } else possibleMilestones = "Unlimited";

    return (
      <div key={"tab" + type}>
        <div className="Polaris-Card__Section">
          <div className="Polaris-Card__SectionHeader">
            <div className="Polaris-Stack Polaris-Stack--alignmentBaseline">
              <div className="Polaris-Stack__Item Polaris-Stack__Item--fill">
                <h3
                  aria-label="Contact Information"
                  className="Polaris-Heading"
                >
                  Active {type} Milestones
                </h3>
              </div>
            </div>
          </div>
          <Stack vertical>
            {activeMilestones.length === 0 && (
              <p className="text-center">
                No Active {type} Milestones. Let's set one!
              </p>
            )}
            {activeMilestones.map((value, index) => {
              return (
                <ActiveMilestone
                  idx={`${type}-${ACTIVE}-${index}`}
                  key={`${type}-${ACTIVE}-${index}`}
                  data={value}
                />
              );
            })}
          </Stack>
        </div>

        <div className="Polaris-Card__Section">
          <div className="Polaris-Card__SectionHeader">
            <div className="Polaris-Stack Polaris-Stack--alignmentBaseline">
              <div className="Polaris-Stack__Item Polaris-Stack__Item--fill">
                <h3
                  aria-label="Contact Information"
                  className="Polaris-Heading"
                >
                  Possible {type} Milestones
                </h3>
              </div>
            </div>
          </div>
          <Stack vertical>
            <Stack.Item>
              <PossibleMilestone
                idx={`${type}-${SPECIFIC}`}
                key={`${type}-${SPECIFIC}`}
                emailable={emailable}
                type={type}
                dateType={SPECIFIC}
                save={this.save}
                disabled={possibleMilestones <= 0}
              />
            </Stack.Item>
            <Stack.Item>
              <PossibleMilestone
                key={`${type}-${RANGE}`}
                idx={`${type}-${RANGE}`}
                emailable={emailable}
                type={type}
                dateType={RANGE}
                save={this.save}
                disabled={possibleMilestones <= 0}
              />
            </Stack.Item>
            {DATETYPES.map((d) => (
              <Stack.Item>
                <PossibleMilestone
                  key={`${type}-${PERIODIC}-${d}`}
                  idx={`${type}-${PERIODIC}-${d}`}
                  emailable={emailable}
                  type={type}
                  dateType={PERIODIC}
                  periodByType={d}
                  save={self.save}
                  disabled={possibleMilestones <= 0}
                />
              </Stack.Item>
            ))}
            {DATETYPES.map((d) => (
              <Stack.Item>
                <PossibleMilestone
                  key={`${type}-${NOPERIOD}-${d}`}
                  idx={`${type}-${NOPERIOD}-${d}`}
                  emailable={emailable}
                  type={type}
                  dateType={NOPERIOD}
                  periodByType={d}
                  save={self.save}
                  disabled={possibleMilestones <= 0}
                />
              </Stack.Item>
            ))}
          </Stack>
        </div>

        <div className="Polaris-Card__Section">
          <div className="Polaris-Card__SectionHeader">
            <div className="Polaris-Stack Polaris-Stack--alignmentBaseline">
              <div className="Polaris-Stack__Item Polaris-Stack__Item--fill">
                <h3
                  aria-label="Contact Information"
                  className="Polaris-Heading"
                >
                  {type} Milestones Reached
                </h3>
              </div>
            </div>
          </div>
          <Stack vertical>
            {reachedMilestones.length === 0 && (
              <p className="text-wrapper">
                You haven't reach any milestones yet. Don't give up! Check the{" "}
                <Button
                  plain
                  onClick={() => {
                    redirectToBestPractices();
                  }}
                >
                  Best Practices
                </Button>{" "}
                tab for tips and tricks to help you reach your goals.
              </p>
            )}
            {reachedMilestones.map((value, index) => {
              return (
                <ReachedMilestone
                  idx={`${type}-${REACHED}-${index}`}
                  key={`${type}-${REACHED}-${index}`}
                  data={value}
                />
              );
            })}
          </Stack>
        </div>
      </div>
    );
  };

  render() {
    const { isReady, milestones } = this.state;
    const { plan } = this.props.merchant;
    const app = this.context;

    const redirectToSubscription = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, "/subscription");
    };

    let activeMilestones = milestones.filter((m) => m.status === ACTIVE);
    let reachedMilestones = milestones.filter((m) => m.status === REACHED);
    let usedMilestones = milestones.filter(
      (m) => m.parent_id === -1 && m.status !== CANCELED
    );

    let possibleMilestones = 0;
    if (plan === BRONZE) {
      // If plan is BRONZE

      possibleMilestones = 3 - usedMilestones.length;
      possibleMilestones = possibleMilestones < 0 ? 0 : possibleMilestones;
    } else if (plan === SILVER) {
      // If plan is SILVER

      possibleMilestones = 3 - usedMilestones.length;
      possibleMilestones = possibleMilestones < 0 ? 0 : possibleMilestones;
    } else possibleMilestones = "Unlimited";

    const settings = {
      autoplay: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const tabs = TYPES.map((t) => {
      return {
        key: `goal-${t}`,
        id: `goal-${t}`,
        content: `Goals for ${t}`,
        accessibilityLabel: `Goals for ${t}`,
        type: t,
      };
    });

    return (
      <Page>
        {isReady ? (
          <Layout>
            <Layout.Section>
              <div className="Polaris-Stack Polaris-Stack--distributionFillEvenly my-16 mx-0 border set-goals">
                <div className="Polaris-Stack__Item py-32 m-0">
                  <p className="Polaris-DisplayText Polaris-DisplayText--sizeLarge text-center">
                    {activeMilestones.length}
                  </p>
                  <p className="Polaris-TextStyle--variationSubdued text-center px-8">
                    Active Milestones
                  </p>
                </div>
                <div className="Polaris-Stack__Item py-32 m-0 border-x">
                  <p className="Polaris-DisplayText Polaris-DisplayText--sizeLarge text-center">
                    {possibleMilestones}
                  </p>
                  <p className="Polaris-TextStyle--variationSubdued text-center px-8">
                    Possible Milestones
                  </p>
                </div>
                <div className="Polaris-Stack__Item py-32 m-0">
                  <p className="Polaris-DisplayText Polaris-DisplayText--sizeLarge text-center">
                    {reachedMilestones.length}
                  </p>
                  <p className="Polaris-TextStyle--variationSubdued text-center px-8">
                    Reached Milestones
                  </p>
                </div>
              </div>
            </Layout.Section>
            <Layout.Section>
              <Card>
                <Tabs
                  tabs={tabs}
                  selected={this.state.selected}
                  onSelect={this.handleTabChange}
                >
                  {this.renderTabContent(
                    milestones,
                    plan,
                    tabs[this.state.selected].type
                  )}
                </Tabs>
              </Card>
              <Card>
                <Card.Section>
                  <Stack spacing="loose" vertical>
                    <Stack.Item>
                      <Stack distribution="center">
                        <ChoosePlanSvg />
                      </Stack>
                    </Stack.Item>
                    <Stack.Item>
                      <h3
                        aria-label="Contact Information"
                        className="Polaris-Heading py-16 text-center"
                      >
                        Want to set more milestones?
                      </h3>
                      <div className="Polaris-TextStyle--variationSubdued text-wrapper">
                        <p>
                          Now that your engine is revving, it's time to open the
                          throttle. Upgrade your plan to set more goals, send
                          more emails, and grow your business!
                        </p>
                      </div>
                    </Stack.Item>
                    <Stack.Item>
                      <Stack distribution="center">
                        <Button
                          primary
                          onClick={() => {
                            redirectToSubscription();
                          }}
                        >
                          Choose Plan
                        </Button>
                      </Stack>
                    </Stack.Item>
                  </Stack>
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        ) : (
          <div className="Polaris-EmptyState Polaris-EmptyState--withinPage">
            <div className="Polaris-EmptyState__Section">
              <div className="Polaris-EmptyState__DetailsContainer">
                <div className="Polaris-EmptyState__Details">
                  <div className="Polaris-TextContainer">
                    <p className="Polaris-DisplayText Polaris-DisplayText--sizeMedium">
                      Hey! Welcome to the Shopify Merchant App.
                    </p>
                    <div className="Polaris-EmptyState__Content">
                      <p>
                        We're excited to help you set realistic, encouraging
                        goals for your store so you can wake up excited about
                        your business each day.
                      </p>
                    </div>
                  </div>
                  <div className="Polaris-EmptyState__Actions">
                    <div className="Polaris-Stack Polaris-Stack--alignmentCenter">
                      <div className="Polaris-Stack__Item">
                        <Button
                          primary
                          loading={this.state.loading}
                          onClick={this.handleReadyClick}
                        >
                          Ready? LET'S GO!
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Polaris-EmptyState__ImageContainer sm-my-16">
                <div className="slider-container">
                  <Slider {...settings}>
                    <div>
                      <div className="text-center">
                        <SetGoalSvg />
                      </div>
                      <h2 className="Polaris-Heading text-center my-16">
                        1. SET YOUR GOALS
                      </h2>
                      <div className="Polaris-TextStyle--variationSubdued text-center mb-16 px-16">
                        Choose from our suggested milestones (recommended) or
                        define your own.
                      </div>
                    </div>
                    <div>
                      <div className="text-center">
                        <TrackGoalSvg />
                      </div>
                      <h2 className="Polaris-Heading text-center my-16">
                        2. TRACK YOUR GOALS
                      </h2>
                      <div className="Polaris-TextStyle--variationSubdued text-center mb-16 px-16">
                        Check your current progress and review past performance.
                      </div>
                    </div>
                    <div>
                      <div className="text-center">
                        <GoodHabitSvg />
                      </div>
                      <h2 className="Polaris-Heading text-center my-16">
                        3. PRACTICE GOOD HABITS
                      </h2>
                      <div className="Polaris-TextStyle--variationSubdued text-center mb-16 px-16">
                        Review tips & tricks from e-commerce experts and learn
                        how to become even better.
                      </div>
                    </div>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
        )}
      </Page>
    );
  }
}

export default Index;
