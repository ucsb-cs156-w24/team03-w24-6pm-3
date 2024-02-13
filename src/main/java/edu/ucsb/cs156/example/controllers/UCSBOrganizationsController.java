package main.java.edu.ucsb.cs156.example.controllers;


import edu.ucsb.cs156.example.entities.UCSBOrganizations;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBOrganizationsRepository;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import javax.validation.Valid;


@Tag(name = "UCSBOrganizations")
@RequestMapping("/api/ucsborganization")
@RestController
@Slf4j
public class UCSBOrganizationsController extends ApiController {


   @Autowired
   UCSBOrganizationsRepository ucsbOrganizationsRepository;

//list all
@Operation(summary= "List all UCSB organizations")
@PreAuthorize("hasRole('ROLE_USER')")
@GetMapping("/all")
public Iterable<UCSBOrganizations> allOrganizations() {
    Iterable<UCSBOrganizations> organizations = ucsbOrganizationsRepository.findAll();
    return organizations;
}


//create
   @Operation(summary= "Create a new organization")
   @PreAuthorize("hasRole('ROLE_ADMIN')")
   @PostMapping("/post")
   public UCSBOrganizations postOrganizations(
       @Parameter(name="orgCode") @RequestParam String orgCode,
       @Parameter(name="orgTranslationShort") @RequestParam String orgTranslationShort,
       @Parameter(name="orgTranslation") @RequestParam String orgTranslation,
       @Parameter(name="inactive") @RequestParam boolean inactive
       )
       {


       UCSBOrganizations organizations = new UCSBOrganizations();
       organizations.setOrgCode(orgCode);
       organizations.setOrgTranslationShort(orgTranslationShort);
       organizations.setOrgTranslation(orgTranslation);
       organizations.setInactive(inactive);
  


       UCSBOrganizations savedOrganization = ucsbOrganizationsRepository.save(organizations);


       return savedOrganization;
   }

//get
   @Operation(summary= "Get a single organization")
   @PreAuthorize("hasRole('ROLE_USER')")
   @GetMapping("")
   public UCSBOrganizations getById(
           @Parameter(name="orgCode") @RequestParam String orgCode) {
       UCSBOrganizations organizations = ucsbOrganizationsRepository.findById(orgCode)
               .orElseThrow(() -> new EntityNotFoundException(UCSBOrganizations.class, orgCode));


       return organizations;
   }

//delete
   @Operation(summary= "Delete a UCSBOrganization")
   @PreAuthorize("hasRole('ROLE_ADMIN')")
   @DeleteMapping("")
   public Object deleteOrganization(
           @Parameter(name="orgCode") @RequestParam String orgCode) {
       UCSBOrganizations organizations = ucsbOrganizationsRepository.findById(orgCode)
               .orElseThrow(() -> new EntityNotFoundException(UCSBOrganizations.class, orgCode));


       ucsbOrganizationsRepository.delete(organizations);
       return genericMessage("UCSBOrganizations with id %s deleted".formatted(orgCode));
   }

// //update
   @Operation(summary= "Update a single organization")
   @PreAuthorize("hasRole('ROLE_ADMIN')")
   @PutMapping("")
   public UCSBOrganizations updateOrganization(
           @Parameter(name="orgCode") @RequestParam String orgCode,
           @RequestBody @Valid UCSBOrganizations incoming) {


       UCSBOrganizations organizations = ucsbOrganizationsRepository.findById(orgCode)
               .orElseThrow(() -> new EntityNotFoundException(UCSBOrganizations.class, orgCode));



       organizations.setOrgCode(incoming.getOrgCode()); 
       organizations.setOrgTranslationShort(incoming.getOrgTranslationShort()); 
       organizations.setOrgTranslation(incoming.getOrgTranslation());
       organizations.setInactive(incoming.getInactive());

       ucsbOrganizationsRepository.save(organizations);


       return organizations;
   }
}



