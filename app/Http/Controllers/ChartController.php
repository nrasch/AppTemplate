<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class ChartController extends Controller
{

private $line_options = array();

public function __construct()
{
  $this->line_options['Alberta'] = [
    'color' => '#434348',
    'dashStyle' => 'Dash',
  ];

  $this->line_options['QLD'] = [
    'color' => '#7cb5ec',
    'dashStyle' => 'Solid',
  ];

}

  public function index()
  {
    return view('charts');
  }

  public function getSales(Request $request)
  {
    $query = DB::table('payment')
    ->select(DB::raw("sum(payment.amount) AS 'Sales', DATE_FORMAT(payment.payment_date, '%Y-%m') AS 'Date', address.district as 'District'"))
    ->join('customer', 'payment.customer_id', '=', 'customer.customer_id')
    ->join('store', 'customer.store_id', '=', 'store.store_id')
    ->join('address', 'store.address_id', '=', 'address.address_id')
    ->groupBy('address.district', DB::raw("DATE_FORMAT(payment.payment_date, '%Y-%m')"))
    ->orderBy('address.district')
    ->orderByRaw("DATE_FORMAT(payment.payment_date, '%Y-%m')");

    if ($request->input('district')) {
      $query->where('address.district', '=', $request->input('district'));
    }

    $sales = $query->get();

    $cats = $sales->pluck('Date')->unique();
    $data = $sales->mapToGroups(function ($item, $key) {
      return [$item->District => $item->Sales];
    });

    $series = array();
    foreach ($data->keys() as $key) {
      $tmp['name'] = $key;
      $tmp['data'] = $data[$key];
      $series[] = array_merge($tmp, $this->line_options[$key]);
     }

     sleep(1);

     return response()->json(['data' => ['categories' => $cats, 'series' => $series]])->setEncodingOptions(JSON_NUMERIC_CHECK);
  }
}
