CREATE MIGRATION m1vd3wymwo776nkbk4wtoltosvsxwjv5xxyaddy4ys7riasg6u5hyq
    ONTO m1o6gcg6aduooylwe5ufyqmechv4q6ryle2nt5nzx7dqahjyz7maga
{
  ALTER TYPE Artist::Artist {
      ALTER LINK members {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::User {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
