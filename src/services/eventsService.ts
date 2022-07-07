import { fetchGraphql } from "../utils/fetchGraphql";
import { ExtrinsicsFilter } from "./extrinsicsService";
import { filterToWhere } from "../utils/filterToWhere";
import { Filter } from "../model/filter";

export type EventsFilter = Filter<{
  id: string;
  name: string;
  section: string;
  method: string;
  signer: string;
  extrinsic: ExtrinsicsFilter;
}>;

const getEvents = async (
  limit: Number,
  offset: Number,
  filter: EventsFilter
) => {
  const where = filterToWhere(filter);

  const response =
    // await fetchGraphql(`query MyQuery { substrate_event(limit: ${limit}, offset: ${offset}, order_by: {indexInBlock: asc}, // TODO enable when order_by works
    await fetchGraphql(`query MyQuery { substrate_event(limit: ${limit}, offset: ${offset},
     where: {${where}}) {
        id
        section
        method
        params
        created_at
        extrinsic {
          id
          hash
          section
          method
          signer
          isSigned
        }
      }}`);
  return response.substrate_event;
};

export { getEvents };
