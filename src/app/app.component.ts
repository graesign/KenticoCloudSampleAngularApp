import { Component, OnDestroy, OnInit } from '@angular/core';
import { CloudError } from 'kentico-cloud-core';
import { ContentItem, ContentType, DeliveryClient, SortOrder, TaxonomyGroup } from 'kentico-cloud-delivery';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Actor } from './models/actor.class';
import { Movie } from './models/movie.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Important - used to unsubsribe ALL subscriptions when component is destroyed. This ensures that requests are cancelled
   * when navigating away from the component.
   * See for more details: https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
   * Usage: use 'takeUntil(this.ngUnsubscribe)' for all subscriptions.
   * Example: this.myThingService.getThings()
   *       .takeUntil(this.ngUnsubscribe)
   *       .subscribe(things => console.log(things));
   */
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private readonly actorType = 'actor';
  private readonly movieType = 'movie';

  public readonly title = 'Kentico Cloud Delivery TypeScript/JavaScript SDK sample';

  public error?: string;

  public latestMovies?: Movie[];
  public actor?: Actor;
  public types?: ContentType[];
  public variousItems?: ContentItem[];
  public taxonomies?: TaxonomyGroup[];

  constructor(private deliveryClient: DeliveryClient) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData(): void {
    this.deliveryClient
      .item<Movie>('warrior')
      .depthParameter(5)
      .getObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(response => {
      });

    // get 'top 3' latest movies
    this.deliveryClient
      .items<Movie>()
      .type(this.movieType)
      .limitParameter(3)
      .orderParameter('elements.title', SortOrder.desc)
      .getObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        response => {
          this.latestMovies = response.items;
        },
        error => this.handleCloudError(error)
      );

    // get single item of 'Character' type
    this.deliveryClient
      .item<Actor>('tom_hardy')
      .getObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        response => {
          this.actor = response.item;
        },
        error => this.handleCloudError(error)
      );

    // get any possible item
    this.deliveryClient
      .items<ContentItem>()
      .getObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        response => {
          console.log(response);
          this.variousItems = response.items;
        },
        error => this.handleCloudError(error)
      );

    // content types
    this.deliveryClient
      .types()
      .getObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        response => {
          this.types = response.types;
        },
        error => this.handleCloudError(error)
      );

    // taxonomies
    this.deliveryClient
      .taxonomies()
      .getObservable()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        response => {
          this.taxonomies = response.taxonomies;
        },
        error => this.handleCloudError(error)
      );
  }

  private handleCloudError(error: CloudError | any): void {
    if (error instanceof CloudError) {
      this.error = `Kentico Cloud Error occured with message: '${
        error.message
        }' for request with id = '${error.requestId}'`;
    } else {
      this.error = 'Unknown error occured';
    }
  }

  private getTaxonomyTerms(taxonomy: TaxonomyGroup): string {
    return taxonomy.terms.map(term => term.name).join(', ');
  }
}
