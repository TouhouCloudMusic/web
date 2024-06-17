CREATE MIGRATION m1jfwfp32yrb5fikrzvpa5ylaukaxm43hcv7cjc5ym33zeu73qccrq
    ONTO initial
{
  CREATE TYPE default::Artist {
      CREATE REQUIRED PROPERTY name: std::str;
  };
  CREATE TYPE default::Release {
      CREATE MULTI LINK artists: default::Artist;
      CREATE REQUIRED PROPERTY title: std::str;
  };
};
