import {
  Card,
  Layout,
  Stack,
  Page,
  Heading,
  Button,
  TextStyle,
  Badge,
  TextField,
  Spinner,
  Select,
} from "@shopify/polaris";
import EmailEditor from "react-email-editor";
import axios from "axios";
import { INIT_TEMPLATE } from "../helpers/Constants";

class EmailTemplates extends React.Component {
  state = {
    designs: [],
    selectedGoalType: "",
    subject: "",
    saving: false,
    loading: false,
  };

  exportHtml = () => {
    this.setState({ saving: true });
    const { id } = this.props.merchant;
    const { selectedGoalType, subject } = this.state;

    this.editor.exportHtml((data) => {
      axios
        .post("/api/template", {
          type: selectedGoalType,
          subject,
          ...data,
          merchant_id: id,
        })
        .then((res) => {
          this.setState({ saving: false });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  handleSelectChange = async (value) => {
    const { id } = this.props.merchant;
    this.setState({ selectedGoalType: value, loading: true });
    const res = await axios.get(
      `/api/template/?merchant_id=${id}&type=${value}`
    );
    if (res.status === 200) {
      if (res.data.template) {
        this.setState({ subject: res.data.template.subject });
        this.editor.loadDesign(res.data.template.design);
      } else {
        this.editor.loadDesign(INIT_TEMPLATE);
        this.setState({ subject: "" });
      }
    }
    this.setState({ loading: false });
  };

  handleChange = (value) => {
    this.setState({ subject: value });
  };

  render() {
    const options = [
      { label: "------", value: "" },
      { label: "Sales", value: "Sales" },
      { label: "Product", value: "Product" },
      { label: "Traffic", value: "Traffic" },
    ];

    const { loading, saving, selectedGoalType, subject } = this.state;

    return (
      <Page fullWidth>
        <Card
          sectioned
          primaryFooterAction={{
            content: "Save",
            onAction: this.exportHtml,
            loading: saving,
            disabled: selectedGoalType === "" || subject === "",
          }}
        >
          <Stack vertical>
            <Stack.Item>
              <Select
                label="Goal Type"
                options={options}
                onChange={this.handleSelectChange}
                value={selectedGoalType}
              />
            </Stack.Item>
            <Stack.Item>
              <TextField
                label={`${selectedGoalType} Email Subject`}
                value={subject}
                onChange={this.handleChange}
              />
            </Stack.Item>
            <Stack.Item>
              <TextStyle>
                {selectedGoalType} Email Template{" "}
                {loading && <Spinner size="small" color="teal" />}
              </TextStyle>
              <div className="email-editor">
                <EmailEditor
                  ref={(editor) => (this.editor = editor)}
                  options={{ displayMode: "email" }}
                />
              </div>
            </Stack.Item>
          </Stack>
        </Card>
      </Page>
    );
  }
}

export default EmailTemplates;
