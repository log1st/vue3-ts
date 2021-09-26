export enum ACLRule {
  organizationsIndex = 'organizationIndex',
  debtorsIndex = 'debtorsIndex',
  exchangeIndex = 'exchangeIndex',
  panelIndex = 'organizationIndex',
}

export const useACL = () => {
  // @TODO надо реализовать проверку
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkAccess = (rule: ACLRule): boolean => true;

  return {
    checkAccess,
  };
};
