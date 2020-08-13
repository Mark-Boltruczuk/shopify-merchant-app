import { Stack, TextStyle, ProgressBar } from "@shopify/polaris";
import PropTypes from "prop-types";
import { Fragment } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ReachedMilestoneIcon from "./ReachedMilestoneIcon";
import EmailSuccessSvg from "./EmailSuccessSvg";
import {
  PRODUCT,
  TRAFFIC,
  SALES,
  TYPES,
  MONTH,
  WEEK,
  DAY,
  NOPERIOD,
  PERIODIC,
  SPECIFIC,
  RANGE,
} from "../helpers/Constants";

class ExampleCustomInput extends React.Component {
  render() {
    return (
      <button
        type="button"
        className="Polaris-Button Polaris-Button--plain Polaris-Button--sizeSlim"
      >
        <span className="Polaris-Button__Content">
          <span className="Polaris-Button__Text">{this.props.value}</span>
        </span>
      </button>
    );
  }
}

class ReachedMilestone extends React.Component {
  render() {
    const { showProgressBar, idx, data } = this.props;
    const {
      type,
      date_type,
      period_by_type,
      product,
      amount,
      period,
      started_at,
      expired_at,
      emailable,
    } = data;

    return (
      <Fragment key={idx}>
        <Stack spacing="loose">
          <Stack.Item fill={true}>
            <div className="pt-4 d-flex">
              <div>
                <ReachedMilestoneIcon />
              </div>
              <div className="milestone-verbiage">
                <span>I want to have</span>

                {TYPES.includes(type) && (
                  <TextStyle variation="strong"> {amount}</TextStyle>
                )}

                {type == PRODUCT && (
                  <TextStyle variation="positive">
                    {" "}
                    {product ? product.title : ""}
                  </TextStyle>
                )}

                {/* Type Field */}
                <span>
                  {" "}
                  {type === TRAFFIC ? "unique site visits" : type.toLowerCase()}
                </span>
                {type == PRODUCT && <span> orders</span>}
                {/* Type Field */}

                {date_type === SPECIFIC && (
                  <Fragment>
                    <span> on </span>
                    <DatePicker
                      selected={new Date(started_at)}
                      customInput={<ExampleCustomInput></ExampleCustomInput>}
                    />
                    <span> alone.</span>
                  </Fragment>
                )}
                {date_type === RANGE && (
                  <Fragment>
                    <span> from </span>
                    <DatePicker
                      selected={new Date(started_at)}
                      customInput={<ExampleCustomInput></ExampleCustomInput>}
                    />
                    <span> to </span>
                    <DatePicker
                      selected={new Date(expired_at)}
                      customInput={<ExampleCustomInput></ExampleCustomInput>}
                    />
                    .
                  </Fragment>
                )}
                {date_type === NOPERIOD && (
                  <span>
                    {" in the next "}
                    <TextStyle variation="strong"> {period}</TextStyle>{" "}
                    <span className="text-lower"> {period_by_type}(s)</span>
                    <span>
                      {"("}
                      <DatePicker
                        selected={new Date(started_at)}
                        customInput={<ExampleCustomInput></ExampleCustomInput>}
                      />
                    </span>
                    <span>
                      {"-"}
                      <DatePicker
                        selected={new Date(expired_at)}
                        customInput={<ExampleCustomInput></ExampleCustomInput>}
                      />
                      {")."}
                    </span>
                  </span>
                )}
                {date_type === PERIODIC && (
                  <span>
                    {" every "}
                    <TextStyle variation="strong"> {period}</TextStyle>{" "}
                    <span className="text-lower"> {period_by_type}(s)</span>
                    <span>
                      {"("}
                      <DatePicker
                        selected={new Date(started_at)}
                        customInput={<ExampleCustomInput></ExampleCustomInput>}
                      />
                    </span>
                    <span>
                      {"-"}
                      <DatePicker
                        selected={new Date(expired_at)}
                        customInput={<ExampleCustomInput></ExampleCustomInput>}
                      />
                      {")."}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </Stack.Item>
          <Stack.Item>{emailable && <EmailSuccessSvg />}</Stack.Item>
        </Stack>
        {showProgressBar && (
          <div className="mx-52 my-8">
            <div className="Polaris-ProgressBar Polaris-ProgressBar--sizeSmall">
              <progress
                className="Polaris-ProgressBar__Progress"
                value="100"
                max="100"
              ></progress>
              <div
                className="Polaris-ProgressBar__Indicator reached-progress"
                style={{ width: "100%" }}
              >
                <span className="Polaris-ProgressBar__Label">100%</span>
              </div>
            </div>
            <div className="text-right mt-4">
              <TextStyle variation="subdued">100%</TextStyle>
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default ReachedMilestone;
