import {
  Stack,
  Card,
  Heading,
  TextContainer,
  Collapsible,
  Button,
} from "@shopify/polaris";

class BestTip extends React.Component {
  state = {
    expanded: false,
  };

  render() {
    const { title, description } = this.props;
    const { expanded } = this.state;

    return (
      <Card.Section>
        <Stack vertical>
          <Stack.Item>
            <Stack>
              <Stack.Item fill>
                <Heading>{title}</Heading>
              </Stack.Item>
              <Stack.Item>
                <Button
                  plain
                  disclosure={expanded ? "up" : "down"}
                  onClick={() => {
                    this.setState({ expanded: !expanded });
                  }}
                >
                  {expanded ? "Show less" : "Show more"}
                </Button>
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Collapsible
              open={expanded}
              transition={{ duration: "150ms", timingFunction: "ease" }}
            >
              <TextContainer>{description}</TextContainer>
            </Collapsible>
          </Stack.Item>
        </Stack>
      </Card.Section>
    );
  }
}

export default BestTip;
