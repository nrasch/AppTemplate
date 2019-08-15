<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ChartController extends Controller
{

    /**
     * Highcharts options common to all charts/graphs
     *
     * @var array
     */
    private $common_options = array();

    /**
     * Highcharts line graph options
     *
     * @var array
     */
    private $line_options = array();


    /**
     * Class constructor
     */
    public function __construct()
    {
        // Set common Highchart options shared by all graphs/charts
        $this->common_options['Alberta'] = [
            'color' => '#434348'
        ];
        $this->common_options['QLD'] = [
            'color' => '#7cb5ec'
        ];

        // Set Highchart options for line graphs
        $this->line_options['Alberta'] = array_merge($this->common_options['Alberta'], [
            'dashStyle' => 'Dash'
        ]);
        $this->line_options['QLD'] = array_merge($this->common_options['QLD'], [
            'dashStyle' => 'solid'
        ]);
    }


    /**
     * Return the 'charts' view which will load the React SPA
     *
     * @return \Illuminate\View\View|\Illuminate\Contracts\View\Factory
     */
    public function index()
    {
        return view('charts');
    }


    /**
     * Pull the sales data from the database, format, and return as JSON
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getSales(Request $request)
    {
        // Create query
        $query = DB::table('payment')->select(DB::raw("sum(payment.amount) AS 'Sales', DATE_FORMAT(payment.payment_date, '%Y-%m') AS 'Date', address.district as 'District'"))
            ->join('customer', 'payment.customer_id', '=', 'customer.customer_id')
            ->join('store', 'customer.store_id', '=', 'store.store_id')
            ->join('address', 'store.address_id', '=', 'address.address_id')
            ->groupBy('address.district', DB::raw("DATE_FORMAT(payment.payment_date, '%Y-%m')"))
            ->orderBy('address.district')
            ->orderByRaw("DATE_FORMAT(payment.payment_date, '%Y-%m')");

        // Apply any filters from user
        if ($request->input('district')) {
            $query->where('address.district', '=', $request->input('district'));
        }

        // Execute query
        $sales = $query->get();

        // Return JSON response
        return response()->json($this->prepData($sales, 'District', 'Sales', $this->line_options))
            ->setEncodingOptions(JSON_NUMERIC_CHECK);
    }

    /**
     * Pull the category data from the database, format, and return as JSON
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getCategories(Request $request)
    {
        // Create query
        $query = DB::table('category')->select(DB::raw("address.district AS 'District', category.name as 'Category', COUNT(inventory.inventory_id) AS 'Count'"))
            ->join('film_category', 'category.category_id', '=', 'film_category.category_id')
            ->join('inventory', 'film_category.film_id', '=', 'inventory.film_id')
            ->join('store', 'inventory.store_id', '=', 'store.store_id')
            ->join('address', 'store.address_id', '=', 'address.address_id')
            ->groupBy('address.district', 'category.name')
            ->orderBy('address.district')
            ->orderBy('category.name');

        // Apply any filters from user
        if ($request->input('district')) {
            $query->where('address.district', '=', $request->input('district'));
        }

        // Execute query
        $counts = $query->get();

        // Return JSON response
        return response()->json($this->prepData($counts, 'District', 'Count', $this->common_options))
            ->setEncodingOptions(JSON_NUMERIC_CHECK);
    }

    /**
     * Pull the rental volume data from the database, format, and return as JSON
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function getRentalVolume(Request $request)
    {
        // Create query
        $query = DB::table('rental')->select(DB::raw("STR_TO_DATE(CONVERT(rental.rental_date, char), '%Y-%m-%d') as 'Date', COUNT(rental_id) as 'Count'"))
            ->join('inventory', 'rental.inventory_id', '=', 'inventory.film_id')
            ->join('store', 'inventory.store_id', '=', 'store.store_id')
            ->join('address', 'store.address_id', '=', 'address.address_id')
            ->groupBy(DB::RAW("STR_TO_DATE(CONVERT(rental.rental_date, char), '%Y-%m-%d')"))
            ->orderBy('Date');

        // Apply any filters from user
        if ($request->input('district')) {
            $query->where('address.district', '=', $request->input('district'));
        }

        // Execute query
        $counts = $query->get();

        // Highcharts needs time series data in milliseconds, so convert
        $data = $counts->map(function ($item, $key) {
            return [
                strtotime(substr($item->Date, 0, 10)) * 1000,
                $item->Count
            ];
        });

        // Create the Hightchart series object
        $series = [
            'type' => 'area',
            'name' => 'Sales Volume',
            'data' => $data
        ];

        // Return JSON response
        return response()->json([
            'data' => [
                'series' => $series
            ]
        ])->setEncodingOptions(JSON_NUMERIC_CHECK);
    }


    /**
     * Takes a database query collection and transforms it into a Highchart series format
     *
     * @param \Illuminate\Support\Collection $collection    Database query collection
     * @param string $pluck_column                          Column in the collection to group the data by
     * @param string $pluck_value                           Values in the collection to extract
     * @param string $graph_options                         Highchart graph/chart options to apply
     * @return array
     */
    private function prepData($collection, $pluck_column, $pluck_value, $graph_options)
    {
        // Assign these to the class, so we can access them in the closure below
        $this->pluck_column = $pluck_column;
        $this->pluck_value = $pluck_value;

        // Collect the category names for the Highchart series
        $cats = $collection->pluck($pluck_column)->unique();

        // Create the Highchart series data element component
        $data = $collection->mapToGroups(function ($item, $key) {
            return [
                $item->{$this->pluck_column} => $item->{$this->pluck_value}
            ];
        });

        // Create the Highchart series element
        $series = array();
        foreach ($data->keys() as $key) {
            $tmp['name'] = $key;
            $tmp['data'] = $data[$key];
            $series[] = array_merge($tmp, $graph_options[$key]);
        }

        // Return the final data element with category and series components
        return ['data' => ['categories' => $cats, 'series' => $series]];
  }

}
