import ConfigFromSwaggers from './ConfigFromSwaggers'

const configFromSwaggers = new ConfigFromSwaggers()
const { additionalResolvers } = configFromSwaggers.getMeshConfigFromSwaggers()

export default additionalResolvers
