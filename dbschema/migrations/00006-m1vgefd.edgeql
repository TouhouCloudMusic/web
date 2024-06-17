CREATE MIGRATION m1vgefdvyjthmn43vapzty7sel7gsokrksc637by3ngp3jbcmrgb3q
    ONTO m1n5wcusszmwl5r6lstoluarokyd7ff7bcuynfywxm7usdhjtorztq
{
  ALTER TYPE default::Artist {
      CREATE MULTI LINK release := (.<artist[IS default::Release]);
      CREATE MULTI LINK song := (.<artist[IS default::Song]);
  };
};
