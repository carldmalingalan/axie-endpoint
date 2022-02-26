import { getClasses } from "@components/classes/helper";

const classQueries = {
  classes: async () => {
    return await getClasses();
  },
};

export default classQueries;
