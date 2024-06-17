CREATE MIGRATION m1jerkhoaxbgesdrpsuao2yu2d2y7yvu5lc4hokwyvarmwzrc22tfa
    ONTO m1jfwfp32yrb5fikrzvpa5ylaukaxm43hcv7cjc5ym33zeu73qccrq
{
  ALTER TYPE default::Release {
      ALTER LINK artists {
          RENAME TO artist;
      };
  };
};
