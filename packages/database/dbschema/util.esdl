module util {
	abstract type WithCreateTime {
		created_at: cal::local_date {
			rewrite insert using (datetime_of_statement());
			readonly := true;
		}
	};

	abstract type WithUpdateTime {
		updated_at: cal::local_date {
			rewrite insert, update using (datetime_of_statement());
		}
	};

	abstract type WithCreateAndUpdateTime extending WithCreateTime, WithUpdateTime {};
}
