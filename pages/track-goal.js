import {
  Card,
  Layout,
  Page,
  TextStyle,
  DisplayText,
  Stack,
} from "@shopify/polaris";

import ActiveMilestone from "../components/ActiveMilestone";
import ReachedMilestone from "../components/ReachedMilestone";
import { ACTIVE, REACHED, EXPIRED } from "../helpers/Constants";

const styledCard = {
  textAlign: "center",
};

class Track extends React.Component {
  render() {
    const { milestones, merchant } = this.props;
    let activeMilestones = milestones.filter((m) => m.status == ACTIVE);
    let reachedMilestones = milestones.filter((m) => m.status == REACHED);
    let expiredMilestones = milestones.filter((m) => m.status === EXPIRED);

    const revenue = merchant.revenue;

    return (
      <Page>
        <Layout>
          <Layout.Section>
            <div className="Polaris-Stack Polaris-Stack--distributionFillEvenly my-16 mx-0 border track-goals">
              <div className="Polaris-Stack__Item py-32 m-0">
                <p className="Polaris-DisplayText Polaris-DisplayText--sizeLarge text-center">
                  {reachedMilestones.length}
                </p>
                <p className="Polaris-TextStyle--variationSubdued text-center px-8">
                  Milestones Reached
                </p>
              </div>
              <div className="Polaris-Stack__Item py-32 m-0 border-x">
                <p className="Polaris-DisplayText Polaris-DisplayText--sizeLarge text-center">
                  +${revenue}
                </p>
                <p className="Polaris-TextStyle--variationSubdued text-center px-8">
                  Milestones Revenue
                </p>
              </div>
              <div className="Polaris-Stack__Item py-32 m-0">
                <p className="Polaris-DisplayText Polaris-DisplayText--sizeLarge text-center">
                  {activeMilestones.length}
                </p>
                <p className="Polaris-TextStyle--variationSubdued text-center px-8">
                  Active Milestones
                </p>
              </div>
            </div>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned title="Active Milestone Progress">
              <Stack vertical>
                {activeMilestones.length === 0 && (
                  <p className="text-center">
                    No Active Milestones. Let's set one!
                  </p>
                )}
                {activeMilestones.map((value, index) => {
                  return (
                    <ActiveMilestone
                      key={index}
                      data={value}
                      showProgressBar={true}
                    />
                  );
                })}
              </Stack>
            </Card>
            <Card sectioned title="Milestones Reached">
              <Stack vertical>
                {reachedMilestones.length === 0 && (
                  <p className="text-center">
                    You haven't reached any milestones yet. Don't give
                    up--you're almost there!
                  </p>
                )}
                {reachedMilestones.map((value, index) => {
                  return (
                    <ReachedMilestone
                      key={index}
                      data={value}
                      showProgressBar={true}
                    />
                  );
                })}
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}
export default Track;
