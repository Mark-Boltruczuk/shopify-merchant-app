import { Stack, Button, ButtonGroup } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import PropTypes from "prop-types";
import { Fragment } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import PossibleMilestoneIcon from "./PossibleMilestoneIcon";
import {
  PRODUCT,
  SALES,
  TRAFFIC,
  TYPES,
  MONTH,
  WEEK,
  DAY,
  ACTIVE,
  SPECIFIC,
  PERIODIC,
  NOPERIOD,
  RANGE,
} from "../helpers/Constants";

class ExampleCustomInput extends React.Component {
  render() {
    return (
      <button
        type="button"
        className="Polaris-Button Polaris-Button--plain Polaris-Button--sizeSlim"
        onClick={this.props.onClick}
      >
        <span className="Polaris-Button__Content">
          <span className="Polaris-Button__Text">{this.props.value}</span>
        </span>
      </button>
    );
  }
}

class PossibleMilestone extends React.Component {
  state = {
    loading: false,
    emailLoading: false,
    open: false,
    product: null,
    amount: "",
    period: "",
    startedAt: new Date(),
    expiredAt: new Date(),
  };

  handleSelection = (resources) => {
    this.setState({ open: false });
    this.setState({ product: resources.selection[0] });
  };

  handleChange = (field) => {
    return (event) => {
      if (event.target && event.target.value) {
        const re = /^[0-9\b]+$/;
        if (event.target.value === "" || re.test(event.target.value)) {
          this.setState({ [field]: event.target.value });
        }
      } else if (field === "startedAt" || field === "expiredAt") {
        if (field === "startedAt") this.setState({ expiredAt: event });
        this.setState({ [field]: event });
      } else {
        this.setState({ [field]: "" });
      }
    };
  };

  initializeState = () => {
    this.setState({
      open: false,
      product: null,
      amount: "",
      period: "",
      startedAt: new Date(),
      expiredAt: new Date(),
    });
  };

  handleSave = async (emailable) => {
    let startedAt = moment(this.state.startedAt).set({
      hour: 0,
      minute: 0,
      second: 0,
    });
    let expiredAt = moment(this.state.expiredAt).set({
      hour: 0,
      minute: 0,
      second: 0,
    });

    switch (this.props.dateType) {
      case SPECIFIC:
        expiredAt.set({ hour: 23, minute: 59, second: 59 });
        break;
      case RANGE:
        startedAt = moment(this.state.startedAt);
        startedAt.set({ hour: 0, minute: 0, second: 0 });
        expiredAt = moment(this.state.expiredAt);
        expiredAt.set({ hour: 23, minute: 59, second: 59 });
        break;
      default:
        expiredAt.add(
          parseInt(this.state.period),
          `${this.props.periodByType.toLowerCase()}s`
        );
        break;
    }

    if (emailable) this.setState({ emailLoading: true });
    else this.setState({ loading: true });

    const data = {
      type: this.props.type,
      product: this.state.product
        ? { id: this.state.product.id, title: this.state.product.title }
        : null,
      amount: parseInt(this.state.amount),
      period: parseInt(this.state.period),
      dateType: this.props.dateType,
      periodByType: this.props.periodByType,
      emailable: this.props.emailable && emailable,
      status: ACTIVE,
      startedAt,
      expiredAt,
    };
    await this.props.save(data);

    if (emailable) this.setState({ emailLoading: false });
    else this.setState({ loading: false });

    this.initializeState();
  };

  render() {
    const { emailable, type, periodByType, dateType, idx } = this.props;
    const today = new Date();

    let disabled =
      this.props.disabled ||
      this.state.amount === "" ||
      parseInt(this.state.amount) <= 0;

    if (dateType === PERIODIC || dateType === NOPERIOD)
      disabled =
        disabled ||
        this.state.period === "" ||
        parseInt(this.state.period) <= 0;

    if (type === PRODUCT) disabled = disabled || this.state.product === null;

    return (
      <Fragment key={idx}>
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={this.state.open}
          allowMultiple={false}
          onSelection={(resources) => this.handleSelection(resources)}
          onCancel={() => this.setState({ open: false })}
        />
        <Stack spacing="loose">
          <Stack.Item fill={true}>
            <div className="pt-4 d-flex">
              <div>
                <PossibleMilestoneIcon />
              </div>
              <div className="milestone-verbiage">
                <span>I want to have</span>

                {/* Amount Field */}
                {TYPES.includes(type) && (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="10"
                    value={this.state.amount}
                    onChange={this.handleChange("amount")}
                  ></input>
                )}
                {/* Amount Field */}

                {/* Product Select Field */}
                {type == PRODUCT && (
                  <Button
                    plain
                    size="slim"
                    onClick={() => this.setState({ open: true })}
                  >
                    {this.state.product
                      ? this.state.product.title
                      : "Select Product..."}
                  </Button>
                )}
                {/* Product Select Field */}

                {/* Type Field */}
                <span>
                  {" "}
                  {type === TRAFFIC ? "unique site visits" : type.toLowerCase()}
                </span>
                {type == PRODUCT && <span> orders</span>}
                {/* Type Field */}

                {/* Specific Date Field */}
                {dateType === SPECIFIC && (
                  <span className="specific">
                    {" on "}
                    <DatePicker
                      minDate={today}
                      selected={this.state.startedAt}
                      onChange={this.handleChange("startedAt")}
                      customInput={<ExampleCustomInput></ExampleCustomInput>}
                    />
                    {" alone."}
                  </span>
                )}
                {/* Specific Date Field */}

                {/* Range Date Field */}
                {dateType === RANGE && (
                  <span>
                    <span>
                      {" from "}
                      <DatePicker
                        minDate={today}
                        selected={this.state.startedAt}
                        onChange={this.handleChange("startedAt")}
                        customInput={<ExampleCustomInput></ExampleCustomInput>}
                      />
                    </span>
                    <span>
                      {" to "}
                      <DatePicker
                        minDate={this.state.startedAt}
                        selected={this.state.expiredAt}
                        onChange={this.handleChange("expiredAt")}
                        customInput={<ExampleCustomInput></ExampleCustomInput>}
                      />
                      .
                    </span>
                  </span>
                )}
                {/* Range Date Field */}

                {/* Periodic Date Field */}
                {dateType === PERIODIC && (
                  <span>
                    <span> every </span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="30"
                      value={this.state.period}
                      onChange={this.handleChange("period")}
                    ></input>
                    <span className="text-lower"> {periodByType}(s).</span>
                  </span>
                )}
                {/* Periodic Date Field */}

                {/* Normal Date Field */}
                {dateType === NOPERIOD && (
                  <span>
                    <span> in the next </span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="30"
                      value={this.state.period}
                      onChange={this.handleChange("period")}
                    ></input>
                    <span className="text-lower"> {periodByType}(s).</span>
                  </span>
                )}
                {/* Normal Date Field */}
              </div>
            </div>
          </Stack.Item>
          <Stack.Item>
            <ButtonGroup>
              {emailable && (
                <Button
                  primary
                  loading={this.state.emailLoading}
                  disabled={disabled}
                  size="slim"
                  onClick={() => this.handleSave(true)}
                >
                  Save Goal & Email
                </Button>
              )}
              <Button
                primary={!emailable}
                plain={emailable}
                loading={this.state.loading}
                disabled={disabled}
                size="slim"
                onClick={() => this.handleSave(false)}
              >
                Save Goal
              </Button>
            </ButtonGroup>
          </Stack.Item>
        </Stack>
      </Fragment>
    );
  }
}

export default PossibleMilestone;
