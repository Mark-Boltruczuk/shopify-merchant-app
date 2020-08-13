import { Layout, Page, Modal, Button, TextContainer } from "@shopify/polaris";
import { Redirect } from "@shopify/app-bridge/actions";
import { Context } from "@shopify/app-bridge-react";
import axios from "axios";

import {
  BRONZE,
  SILVER,
  GOLD,
  PLUS,
  BRONZE_MILESTONES,
  SILVER_MILESTONES,
} from "../helpers/Constants";
import FulfilledSvg from "../components/FulfilledSvg";

class Subscription extends React.Component {
  static contextType = Context;

  state = {
    loading: false,
    plan: "",
    newPlan: "",
    active: false,
    removalCount: 0,
  };

  handlePlanClick = async (plan) => {
    if (
      plan === BRONZE &&
      BRONZE_MILESTONES < this.props.merchant.milestone_used
    ) {
      this.setState({
        active: true,
        removalCount: this.props.merchant.milestone_used - BRONZE_MILESTONES,
        plan,
      });
    } else if (
      plan === SILVER &&
      SILVER_MILESTONES < this.props.merchant.milestone_used
    ) {
      this.setState({
        active: true,
        removalCount: this.props.merchant.milestone_used - SILVER_MILESTONES,
        plan,
      });
    } else {
      this.setState({ newPlan: plan, loading: true });
      const res = await axios.post("/api/choosePlan", {
        plan,
        merchant_id: this.props.merchant.id,
      });
      if (res.status === 200) {
        if (plan === BRONZE) {
          const app = this.context;
          const redirect = Redirect.create(app);
          redirect.dispatch(Redirect.Action.APP, "/");
        } else window.top.location = res.data.confirmationUrl;
      } else {
      }
    }
  };

  handleCancel = () => {
    this.setState({ active: false });
  };

  handleConfirm = async () => {
    const { plan } = this.state;

    this.setState({ active: false });
    this.setState({ newPlan: plan, loading: true });

    const res = await axios.post("/api/choosePlan", {
      plan,
      merchant_id: this.props.merchant.id,
      removal_count: this.state.removalCount,
    });
    if (res.status === 200) {
      if (plan === BRONZE) {
        const app = this.context;
        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.APP, "/");
      } else window.top.location = res.data.confirmationUrl;
    } else {
    }
  };

  render() {
    const { plan, is_plus } = this.props.merchant;
    const { active, removalCount } = this.state;
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <p className="Polaris-DisplayText Polaris-DisplayText--sizeMedium text-center m-32">
              Ready to take your goal-setting to the next level? Choose the plan
              that's right for you to stay motivated!
            </p>
            <div className="Polaris-Stack Polaris-Stack--distributionFillEvenly Subscription-Stack">
              <div className="Polaris-Stack__Item">
                <div className="Polaris-Card">
                  <div className="Polaris-Card__Header Sub-Polaris-Card__Header">
                    <h2 className="Polaris-Heading">{BRONZE}</h2>
                  </div>
                  <div className="Polaris-Card__Section">
                    <ul className="Polaris-List Sub-Polaris-List">
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            Up to 3 goals
                          </span>{" "}
                          per month
                        </span>
                      </li>
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            Send 2 emails
                          </span>{" "}
                          per month
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="Polaris-Card__Footer Sub-Polaris-Card__Footer">
                    <div className="full-width">
                      <h2 className="Polaris-Heading Polaris-Footer-Heading">
                        FREE
                      </h2>
                      <Button
                        primary
                        fullWidth
                        disabled={plan === BRONZE}
                        loading={
                          this.state.loading && this.state.newPlan === BRONZE
                        }
                        onClick={() => this.handlePlanClick(BRONZE)}
                      >
                        {plan === BRONZE ? "Current" : "Choose"} Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Polaris-Stack__Item">
                <div className="Polaris-Card">
                  <div className="Polaris-Card__Header Sub-Polaris-Card__Header">
                    <h2 className="Polaris-Heading">{SILVER}</h2>
                  </div>
                  <div className="Polaris-Card__Section">
                    <ul className="Polaris-List Sub-Polaris-List">
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            Up to 5 goals
                          </span>{" "}
                          per month
                        </span>
                      </li>
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            Send 3 emails
                          </span>{" "}
                          per month
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="Polaris-Card__Footer Sub-Polaris-Card__Footer">
                    <div className="full-width">
                      <h2 className="Polaris-Heading Polaris-Footer-Heading">
                        $9.99/month
                      </h2>
                      <Button
                        primary
                        fullWidth
                        disabled={plan === SILVER}
                        loading={
                          this.state.loading && this.state.newPlan === SILVER
                        }
                        onClick={() => this.handlePlanClick(SILVER)}
                      >
                        {plan === SILVER ? "Current" : "Choose"} Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Polaris-Stack__Item">
                <div className="Polaris-Card gold-card">
                  <div className="Polaris-Card__Header Sub-Polaris-Card__Header">
                    <h2 className="Polaris-Heading">
                      <span>{GOLD}</span>{" "}
                      <span className="offer-badge">Best Offer</span>
                    </h2>
                  </div>
                  <div className="Polaris-Card__Section">
                    <ul className="Polaris-List Sub-Polaris-List">
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            UNLIMITED goals
                          </span>{" "}
                          per month
                        </span>
                      </li>
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            UNLIMITED emails
                          </span>{" "}
                          per month
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="Polaris-Card__Footer Sub-Polaris-Card__Footer">
                    <div className="full-width">
                      <h2 className="Polaris-Heading Polaris-Footer-Heading">
                        $19.99/month
                      </h2>
                      <Button
                        primary
                        fullWidth
                        disabled={plan === GOLD}
                        loading={
                          this.state.loading && this.state.newPlan === GOLD
                        }
                        onClick={() => this.handlePlanClick(GOLD)}
                      >
                        {plan === GOLD ? "Current" : "Choose"} Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Polaris-Stack__Item">
                <div className="Polaris-Card">
                  <div className="Polaris-Card__Header Sub-Polaris-Card__Header">
                    <h2 className="Polaris-Heading">Shopify {PLUS} Only</h2>
                  </div>
                  <div className="Polaris-Card__Section">
                    <ul className="Polaris-List Sub-Polaris-List">
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            UNLIMITED goals
                          </span>{" "}
                          per month
                        </span>
                      </li>
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          <span className="Polaris-TextStyle--variationStrong">
                            UNLIMITED emails
                          </span>{" "}
                          per month
                        </span>
                      </li>
                      <li className="Polaris-List__Item Sub-Polaris-List__Item">
                        <span className="fulfilled-icon">
                          <FulfilledSvg />
                        </span>
                        <span className="ml-16">
                          Use with Wholesale channel
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="Polaris-Card__Footer Sub-Polaris-Card__Footer">
                    <div className="full-width">
                      <h2 className="Polaris-Heading Polaris-Footer-Heading">
                        $29.99/month
                      </h2>
                      <Button
                        primary
                        fullWidth
                        disabled={plan === PLUS || !is_plus}
                        loading={
                          this.state.loading && this.state.newPlan === PLUS
                        }
                        onClick={() => this.handlePlanClick(PLUS)}
                      >
                        {plan === PLUS ? "Current" : "Choose"} Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Layout.Section>
        </Layout>
        <Modal
          open={active}
          onClose={this.handleCancel}
          title="Please confirm your subscription downgrade"
          primaryAction={{
            content: "No, keep this plan",
            onAction: this.handleCancel,
          }}
          secondaryActions={[
            {
              content: "Yes, confirm",
              onAction: this.handleConfirm,
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                Hey there, please note that if you are downgrading your plan and
                your most recent ({removalCount}) milestones will be deleted.
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Page>
    );
  }
}
export default Subscription;
