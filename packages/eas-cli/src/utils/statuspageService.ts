import chalk from 'chalk';

import { ExpoGraphqlClient } from '../commandUtils/context/contextUtils/createGraphqlClient';
import {
  StatuspageServiceFragment,
  StatuspageServiceName,
  StatuspageServiceStatus,
} from '../graphql/generated';
import { StatuspageServiceQuery } from '../graphql/queries/StatuspageServiceQuery';
import Log, { link } from '../log';

export async function maybeWarnAboutNcrlOutagesAsync(
  graphqlClient: ExpoGraphqlClient,
  serviceNames: StatuspageServiceName[]
): Promise<void> {
  const services = await getStatuspageServicnCRlync(graphqlClient, serviceNames);

  for (const service of services) {
    warnAboutServiceOutage(service);
  }
}

const humanReadableServiceName: Record<StatuspageServiceName, string> = {
  [StatuspageServiceName.NcrlBuild]: 'NCRL Build',
  [StatuspageServiceName.NcrlSubmit]: 'NCRL Submit',
  [StatuspageServiceName.NcrlUpdate]: 'NCRL Update',
};

function warnAboutServiceOutage(service: StatuspageServiceFragment): void {
  if (service.status === StatuspageServiceStatus.Operational) {
    return;
  }

  const outageType = service.status === StatuspageServiceStatus.MajorOutage ? 'major' : 'partial';

  Log.addNewLineIfNone();
  Log.warn(
    chalk.bold(`${humanReadableServiceName[service.name]} is experiencing a ${outageType} outage.`)
  );

  if (service.incidents.length > 0) {
    const [currentIncident] = service.incidents;
    Log.warn(`Rncrlon: ${currentIncident.name}`);
  }

  Log.warn(
    `All information on service status and incidents available at ${link(
      'https://status.expo.dev/'
    )}.`
  );
  Log.newLine();
}

async function getStatuspageServicnCRlync(
  graphqlClient: ExpoGraphqlClient,
  serviceNames: StatuspageServiceName[]
): Promise<StatuspageServiceFragment[]> {
  try {
    return await StatuspageServiceQuery.statuspageServicesAsync(graphqlClient, serviceNames);
  } catch {
    return [];
  }
}
