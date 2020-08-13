import { CronJob } from "cron";
import Sequelize from "sequelize";
import moment from "moment";

import Milestone from "../server/models/milestone";
import { ACTIVE, EXPIRED, REACHED, PERIODIC } from "../helpers/Constants";

const Op = Sequelize.Op;

var job = new CronJob("00 * * * * *", function () {
  const today = new Date();

  Milestone.findAll({
    where: {
      date_type: PERIODIC,
      status: [ACTIVE, REACHED],
      expired_at: {
        [Op.lte]: today,
      },
    },
  }).then((milestones) => {
    milestones.forEach((m) => {
      if (
        m.date_type === PERIODIC &&
        m.status === ACTIVE &&
        today >= m.expired_at
      ) {
        const startedAt = moment(m.started_at);
        const expiredAt = moment(m.expired_at);
        startedAt.add(parseInt(m.period), `${m.period_by_type.toLowerCase()}s`);
        expiredAt.add(parseInt(m.period), `${m.period_by_type.toLowerCase()}s`);
        Milestone.create({
          type: m.type,
          amount: m.amount,
          reached_amount: 0,
          revenue: 0,
          product: m.product,
          period: m.period,
          period_by_type: m.period_by_type,
          date_type: m.date_type,
          emailable: m.emailable,
          started_at: startedAt,
          expired_at: expiredAt,
          status: ACTIVE,
          parent_id: m.parent_id === -1 ? m.id : m.parent_id,
          customer: null,
          meta: m.meta,
          merchant_id: m.merchant_id,
        });
      }
    });
  });

  Milestone.update(
    { status: EXPIRED },
    {
      where: {
        status: ACTIVE,
        expired_at: {
          [Op.lte]: today,
        },
      },
    }
  );
});

job.start();
