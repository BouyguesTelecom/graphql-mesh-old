import ConfigFromSwaggers from './configFromSwaggers'

const configFromSwaggers = new ConfigFromSwaggers()
const { additionalResolvers } = configFromSwaggers.getMeshConfigFromSwaggers()

export default additionalResolvers
