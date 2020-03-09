/* eslint-disable no-undef */
import { Selector } from 'testcafe';

// eslint-disable-next-line no-unused-expressions
fixture`queryBuilder`.page`http://localhost:3000/login/${process.env.GOOGLE_TOKEN}`;

test('testSelectCheckbox', async t => {
  const timeout = { timeout: 30000 };
  await t
    .click(Selector('a').withText('V2F_GWAS_Summary_Stats'))
    .click(Selector('span').withText('QUERY DATASET'))
    .click(
      Selector('.MuiSvgIcon-root')
        .with(timeout)
        .nth(11)
        .find('path'),
    )
    .click(
      Selector('div')
        .withText('phenotype')
        .nth(15)
        .find('.MuiSvgIcon-root'),
    )
    .click(
      Selector('div')
        .withText('ancestry')
        .nth(20)
        .find('.MuiSvgIcon-root'),
    )
    .click(Selector('label').withText('EU'))
    .click(Selector('label').withText('Mixed'))
    .click(Selector('span').withText('APPLY FILTERS'))
    .click(Selector('span').withText('CLEAR ALL'));
});
