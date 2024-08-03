$date_search[] = array(
	'key'     => '_event_start_date',
	'value'   =>  $dates['end'],
	'compare' => '<=',
	'type'    => 'date'
);
$date_search[] = array(
	'key'     => '_event_start_date',
	'value'   => $dates['start'],
	'compare' => '>=',
	'type'    => 'date'
);

-- CHANGE --
_event_start_date <= end
AND
_event_end_date >= start