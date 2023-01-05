import 'reflect-metadata';
import 'typeorm-aurora-data-api-driver';
import { DataSource, EntityManager } from 'typeorm';
import { User, AccessTokens } from '@enties/index';

let dataSource: DataSource;

const getDBConnection = async (): Promise<EntityManager> => {
  if (dataSource && dataSource.isInitialized) {
    console.log('Already Connection Created! Using Same Connection!');
    return dataSource.manager;
  } else {
    console.log('No DB Connection Found! Creating New Connection!');
    dataSource = new DataSource({
      type: 'aurora-mysql',
      region: 'ap-northeast-1',
      secretArn: process.env.AURORA_SECRET_ARN,
      resourceArn: process.env.AURORA_RESOURCE_ARN,
      database: process.env.MYSQL_DATABASE,
      synchronize: true,
      entities: [User, AccessTokens],
    });

    return await dataSource
      .initialize()
      .then(() => {
        console.log('New DB Created!');
        return dataSource.manager;
      })
      .catch((e) => {
        console.debug('Error Occured in DB creation', e);
        throw new Error(e);
      });
  }
};

export { getDBConnection };
